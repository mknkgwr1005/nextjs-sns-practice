const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const isAuthenticated = require("../middlewares/isAuthenticated");

const prisma = new PrismaClient();

router.get("/find", isAuthenticated, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    console.log(req);
    console.log(user);

    if (!user) {
      res.status(404).json({ message: "ユーザーが見つかりませんでした" });
    }

    res.status(200).json({
      user: { id: user.id, email: user.email, username: user.username },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/profile/:userId", isAuthenticated, async (req, res) => {
  console.log(req);
  const { userId } = req.params;
  console.log(userId);

  try {
    const profile = await prisma.profile.findUnique({
      where: {
        userId: parseInt(userId),
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });
    if (!profile) {
      return res
        .status(404)
        .json({ message: "プロフィールが見つかりませんでした。" });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;
