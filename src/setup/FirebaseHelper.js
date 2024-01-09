import { admin } from './firebase-config'
import * as Api from "../setup/ApiResponse";

export function sendPushNotificationFCM(registrationToken, title, body, req_id, product_id, status, flag) {
  // console.log("Calledd.....");

  // console.log("registrationToken::", registrationToken);
  // console.log("title::", title);
  // console.log("body::", body);
  // console.log("req_id::", req_id);
  // console.log("product_id::", product_id);
  // console.log("status::", status);
  // console.log("flag::", flag);

  var payload = {
    notification: {
      title: title,
      body: body
    },
    data: {
      title: title,
      body: body,
      req_id: req_id,
      product_id: product_id,
      status: status
    }
  };

  var options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
  };

  // console.log("beforeIF:::::");
  if (flag == true) {

    console.log("inside....");
    admin.messaging().sendToDevice(registrationToken, payload, options)
      .then(function (response) {

        console.log("Successfully sent message:", response); 
      })
      .catch(function (error) {
        console.log("Error sending message:", error);
      });
  } else {
    console.log("FlagFalse...");
  }


}
