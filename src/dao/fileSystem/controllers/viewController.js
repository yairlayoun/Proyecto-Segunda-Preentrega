export const profileView = (req, res) => {
    res.render('profile', { user: req.session.user });
  };