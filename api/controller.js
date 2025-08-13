import { razorpay } from "./razorpay.js";
import { postRequestSchema } from "./validation.js";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase.js";

export async function getPaymentLinkHandler(req, res) {
  try {
    const SERVER_URL = process.env.SERVER_URL;
    const result = postRequestSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        message: result.error.issues[0].message,
      });
      return;
    }

    const paymentLink = await razorpay.paymentLink.create({
      amount: 4900,
      customer: {
        name: result.data.customer_name,
        contact: result.data.customer_contact.toString(),
        email: result.data.customer_email,
      },
      reference_id: result.data.reference_id,
      currency: "INR",
      callback_url: `${SERVER_URL}/payment-confirmation`,
      callback_method: "get",
      description: "Student registrations fees",
      notify: {
        email: true,
      },
    });

    res.json({
      message: "Payment link created",
      payment_link: paymentLink.short_url,
      payment_id: paymentLink.id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Unexpected error occurred",
    });
  }
}

export async function varifyPaymentHandeler(req, res) {
  try {
    const CLIENT_URL = process.env.CLIENT_URL;
    const paymentLinkId = req.query.razorpay_payment_link_id;
    const paymentDetails = await razorpay.paymentLink.fetch(paymentLinkId);
    const { reference_id, payments, status, id } = paymentDetails;

    const paymentCollectionRef = collection(db, "payment");
    const bookingDocRef = doc(db, "registrations", reference_id);

    if (!payments || status !== "paid" || payments.status === "failed") {
      const payment = Array.isArray(payments) ? payments[0] : payments;

      const snapShot = await addDoc(paymentCollectionRef, {
        amount: payment ? Number(payment.amount) / 100 : 0,
        createdAt: payment ? new Date(payment.created_at * 1000) : null,
        method: payment.method || "",
        paymentId: payment.payment_id || "",
        paymentLinkId: id,
        paymentStatus: payment.status || "",
        status: status,
        orderId: reference_id || "",
      });

      await updateDoc(bookingDocRef, {
        paymentStatus: false,
        paymentId: snapShot.id,
      });
      res.redirect(
        `${CLIENT_URL}/payment-result?status=false&payment_id=${snapShot.id}`
      );
      return;
    }

    const payment = Array.isArray(payments) ? payments[0] : payments;

    const snapShot = await addDoc(paymentCollectionRef, {
      amount: payment ? Number(payment.amount) / 100 : 0,
      createdAt: payment ? new Date(payment.created_at * 1000) : null,
      method: payment.method || "",
      paymentId: payment.payment_id || "",
      paymentLinkId: id,
      paymentStatus: payment.status || "",
      status: status,
      orderId: reference_id || "",
    });

    await updateDoc(bookingDocRef, {
      paymentStatus: true,
      paymentId: snapShot.id,
    });

    // const bookingData = await getDoc(bookingDocRef);

    // const mailData = {
    //   slots: [
    //     ...bookingData.data().slots.map(({ offerPrice, ...rest }) => ({
    //       ...rest,
    //       price: offerPrice,
    //     })),
    //   ],
    //   totalAmount: bookingData.data().prizeBreakThrough.totalAmount,
    //   amountPaid: bookingData.data().prizeBreakThrough.amountPaid,
    //   name: bookingData.data().name,
    //   bookingDate: bookingData.data().bookingDate.toDate(),
    //   bookingId: bookingData.id,
    //   paymentDate: bookingData.data().createdAt.toDate(),
    //   paymentId: bookingData.data().paymentId,
    // };

    // const q = query(
    //   userCollectionRef,
    //   where("uid", "==", bookingData.data().uid)
    // );
    // const userSnapShots = await getDocs(q);
    // const user = userSnapShots.docs[0].data();

    // if (user.email === bookingData.data().email) {
    //   await sendMail({
    //     data: mailData,
    //     to: user.email,
    //   });
    // } else {
    //   await Promise.all([
    //     sendMail({
    //       data: mailData,
    //       to: user.email,
    //     }),
    //     sendMail({
    //       data: mailData,
    //       to: bookingData.data().email,
    //     }),
    //   ]);
    // }

    res.redirect(
      `${CLIENT_URL}/payment-result?status=true&payment_id=${snapShot.id}`
    );
  } catch (error) {
    const CLIENT_URL = process.env.CLIENT_URL;
    console.log(error);
    res.redirect(`${CLIENT_URL}/payment-result?status=false`);
  }
}
