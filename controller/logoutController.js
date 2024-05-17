export const logOut = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error occurred while destroying session data:', err);
    } else {
      res.redirect('/');
    }
  });
};
