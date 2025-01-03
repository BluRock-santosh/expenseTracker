export const userRegistrationEmailContent = (username) => ({
    subject: "Welcome to Expense Tracker",
    text: `Hello ${username},\n\nThank you for registering with Expense Tracker! We're excited to help you manage your expenses and keep track of your finances. You can now start adding your expenses and monitor your spending easily.\n\nIf you need assistance, feel free to reach out to our support team.\n\nBest regards,\nYour Expense Tracker Team`,
    html: `
      <p>Hello ${username},</p>
      <p>Thank you for registering with Expense Tracker! We're excited to help you manage your expenses and keep track of your finances.</p>
      <p>You can now start adding your expenses and monitor your spending easily.</p>
      <p>If you need assistance, feel free to reach out to our support team.</p>
      <p>Best regards,<br>Your Expense Tracker Team</p>
    `,
  });



