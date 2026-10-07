const SMS_TIMEOUT_MS = 10000;

export const sendAuthCode = async (Mobile) => {
  try {
    const res = await fetch("https://api.limosms.com/api/sendcode", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        ApiKey: process.env.SMS_KEY,
      },
      body: JSON.stringify({
        Mobile,
        Footer: "RokadCollage",
      }),
      signal: AbortSignal.timeout(SMS_TIMEOUT_MS),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return { success: false, message: error.name === "TimeoutError" ? "مهلت زمانی اتصال به سامانه پیامک به پایان رسید" : error.message };
  }
};

export const verifyCode = async (Mobile, Code) => {
  try {
    const res = await fetch("https://api.limosms.com/api/checkcode", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        ApiKey: process.env.SMS_KEY,
      },
      body: JSON.stringify({
        Mobile,
        Code,
      }),
      signal: AbortSignal.timeout(SMS_TIMEOUT_MS),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return { success: false, message: "خطا در بررسی کد" };
  }
};
