export const showAdminPage = (req, res) => {
  try {
    const { userId } = req.session;
    const { type } = req.session;
    res.render('admin.ejs', { userId, type });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
};
