const express = require("express");
const cors = require("cors");
const { getDocs, collection, setDoc, doc } = require("firebase/firestore");

const app = express();
const db = require("./firebase");
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.json({
    message: `Hello Midnite`,
  });
});

app.get("/events", (req, res) => {
  console.log("res", db);

  res.json({
    message: JSON.stringify(req.body),
  });
});

app.post("/events", (req, res) => {
  var users = [],
    id,
    data;
  getDocs(collection(db, "userData")).then((snapshot) => {
    snapshot.docs.every((doc) => {
      data = doc.data();
      if (data.user_id === req.body.user_id) {
        id = doc.id;
        users.push(data);
        return false;
      }
      console.log("first");
      return true;
    });
    console.log("data", data);
    let resultCodes = [];
    let amount = parseFloat(req.body.amount);

    amount = req.body.type === "deposit" ? amount : -1 * amount;
    let amountArr = users[0].amount;
    amountArr.push({ amt: req.body.amount.toString(), time: req.body.t });
    let len = amountArr.length;

    if (amount < -100) {
      resultCodes.push(1100);
    }
    if (len > 2) {
      if (
        parseFloat(amountArr[len - 1].amt) < 0 &&
        parseFloat(amountArr[len - 2].amt) < 0 &&
        parseFloat(amountArr[len - 3].amt) < 0
      ) {
        resultCodes.push(30);
      } else {
        // check 3 increasing deposit
        let lastAmount = Number.MAX_SAFE_INTEGER,
          cnt = 0;
        for (let index = len - 1; index >= 0; index--) {
          let currAmount = parseFloat(amountArr[index].amt);
          if (currAmount > 0) {
            if (lastAmount < currAmount) {
              break;
            }
            cnt++;
            if (cnt >= 3) break;
          }
        }
        if (cnt >= 3) resultCodes.push(300);
      }
    }
    let sum = 0,
      currTimestamp = req.body.t;
    for (let index = len - 1; index >= 0; index--) {
      if (amountArr[index].time < currTimestamp - 30) {
        break;
      }
      sum += parseFloat(amountArr[index].amt);
    }
    if (sum > 200) {
      resultCodes.push(123);
    }

    // post added amount to userId
    const userDataRef = doc(db, "userData", id);
    setDoc(userDataRef, data, { merge: true });

    res.json({
      message: {
        alert: resultCodes.length > 0,
        alert_codes: resultCodes,
        user_id: req.body.user_id,
      },
    });
  });
  console.log("users3", users);
});

app.listen(5000, () => {
  console.log("Listening on http://localhost:5000");
});
