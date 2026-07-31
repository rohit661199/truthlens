import { createTransport } from "nodemailer";

export const sendOtpMail = async (to, otp) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });
  const html = `<p>Your OTP for password rreset is <b>${otp}</b>. It expires in 5 minutes.</p>`;
  await transport.sendMail({
    from: process.env.EMAIL,
    to,
    subject:"Reset Your Password",
    html:html,
  });
};
export default sendOtpMail;

 


  
  
  



