const express = require("express");
const router = express.Router();
const Category = require("../../models/Category");
const Product = require("../../models/Product");
const Order = require("../../models/Order");
const User = require("../../models/User");
const fs = require("fs");
const path = require("path");

// const categoryController = require("../controller/categories");

const multer = require("multer");
// const { loginCheck } = require("../middleware/auth");

// Image Upload setting
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/categories");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

var Pstorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/products");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const Pupload = multer({ storage: Pstorage });

router.get("/get-count", async (req, res, next) => {
  let categoryCount = await Category.count();
  let productCount = await Product.count();
  let orderCount = await Order.count();
  let userCount = await User.count();
  return res.json({ categoryCount, productCount, orderCount, userCount });
});

router.get("/all-category", async (req, res, next) => {
  try {
    let Categories = await Category.find({}).sort({ _id: -1 });
    if (Categories) {
      return res.json({ Categories });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/add-category", upload.single("cImage"), async (req, res, next) => {
    console.log(req.body);
    let { cName, cDescription, cStatus, cType } = req.body;
    let cImage = req.file.filename;
    const filePath = `../server/public/uploads/categories/${cImage}`;

    if (!cName || !cDescription || !cStatus || !cImage || !cType) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
        }
        return res.json({ error: "All fields must be required" });
      });
    } else {
      // cName = (cName);
      try {
        let checkCategoryExists = await Category.findOne({
          cName: cName,
          cType: cType
        });
        if (checkCategoryExists) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.log(err);
            }
            return res.json({ error: "Category already exists" });
          });
        } else {
          let newCategory = new Category({
            cName,
            cDescription,
            cStatus,
            cImage,
            cType,
          });
          await newCategory.save((err) => {
            if (!err) {
              return res.json({ success: "Category created successfully" });
            }
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
);
// router.post("/edit-category", loginCheck, categoryController.postEditCategory);
router.post("/delete-category", async (req, res, next) => {
  let { cId } = req.body;
  if (!cId) {
    return res.json({ error: "All fields must be required" });
  } else {
    try {
      let deletedCategoryFile = await Category.findById(cId);
      const filePath = `../server/public/uploads/categories/${deletedCategoryFile.cImage}`;

      let deleteCategory = await Category.findByIdAndDelete(cId);
      if (deleteCategory) {
        // Delete Image from uploads -> categories folder
        fs.unlink(filePath, (err) => {
          if (err) {
            console.log(err);
          }
          return res.json({ success: "Category deleted successfully" });
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
});

// function deleteImages(images, mode) {
//   console.log(images);
//   var basePath =
//     path.resolve(__dirname + "../../../") + "/public/uploads/products/";
//   console.log(basePath);
//   for (var i = 0; i < images.length; i++) {
//     let filePath = "";
//     if (mode == "file") {
//       filePath = basePath + `${images[i].filename}`;
//     } else {
//       filePath = basePath + `${images[i]}`;
//     }
//     console.log(filePath);
//     if (fs.existsSync(filePath)) {
//       console.log("Exists image");
//     }
//     fs.unlink(filePath, (err) => {
//       if (err) {
//         return err;
//       }
//     });
//   }
// }

function pdeleteImages(images, mode) {
  var basePath =
    path.resolve(__dirname + "../../../") + "/public/uploads/products/";
  console.log(basePath);
  for (var i = 0; i < images.length; i++) {
    let filePath = "";
    if (mode == "file") {
      filePath = basePath + `${images[i].filename}`;
    } else {
      filePath = basePath + `${images[i]}`;
    }
    console.log(filePath);
    if (fs.existsSync(filePath)) {
      console.log("Exists image");
    }
    fs.unlink(filePath, (err) => {
      if (err) {
        return err;
      }
    });
  }
}




router.get("/all-products", async (req, res, next) => {
  try {
    let Products = await Product.find({})
      .populate("pCategory", "_id cName")
      .sort({ _id: -1 });
    if (Products) {
      return res.json({ Products });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/add-product", Pupload.any(), async (req, res, next) => {
  let {
    pName,
    pDescription,
    pPrice,
    pQuantity,
    pType,
    pCategory,
    pOffer,
    pStatus,
  } = req.body;
  let images = req.files;
  console.log(images);
  // Validation
  if (
    !pName |
    !pDescription |
    !pPrice |
    !pQuantity |
    !pCategory |
    !pOffer |
    !pStatus |
    !pType
  ) {
    pdeleteImages(images, "file");
    return res.json({ error: "All fields must be required" });
  }
  // Validate Name and description
  else if (pName.length > 255 || pDescription.length > 3000) {
    pdeleteImages(images, "file");
    return res.json({
      error: "Name 255 & Description must not be 3000 character long",
    });
  } else {
    try {
      let allImages = [];
      for (const img of images) {
        allImages.push(img.filename);
      }
      let newProduct = new Product({
        pImages: allImages,
        pName,
        pDescription,
        pPrice,
        pType,
        pQuantity,
        pCategory,
        pOffer,
        pStatus,
      });
      let save = await newProduct.save();
      if (save) {
        return res.json({ success: "Product created successfully" });
      }
    } catch (err) {
      console.log(err);
    }
  }
});



router.post("/edit-product", Pupload.any(), async (req, res, next) => {
  let {
    pId,
    pName,
    pDescription,
    pPrice,
    pQuantity,
    pCategory,
    pType,
    pOffer,
    pStatus,
    pImages,
  } = req.body;
  let editImages = req.files;
  console.log("f", editImages,pImages);
  // pCategory=pCategory.trim();
  // Validate other fileds
  if (
    !pId |
    !pName |
    !pDescription |
    !pPrice |
    !pQuantity |
    !pCategory |
    !pOffer |
    !pStatus |
    !pType
  ) {
    return res.json({ error: "All fields must be required" });
  }
  // Validate Name and description
  else if (pName.length > 255 || pDescription.length > 3000) {
    return res.json({
      error: "Name 255 & Description must not be 3000 character long",
    });
  }
  // Validate Update Images
  let editData = {
    pName,
    pDescription,
    pPrice,
    pQuantity,
    pCategory,
    pType,
    pOffer,
    pStatus,
  };
  if (editImages.length > 0) {
    let allEditImages = [];
    for (const img of editImages) {
      allEditImages.push(img.filename);
    }
    editData = { ...editData, pImages: allEditImages };
    pdeleteImages(pImages.split(","), "string");
  }
  try {
    console.log(editData);
    let editProduct = Product.findByIdAndUpdate(pId, editData);
    editProduct.exec((err) => {
      if (err) console.log(err);
      return res.json({ success: "Product edit successfully" });
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/delete-product", async (req, res, next) => {
  let { pId } = req.body;
  if (!pId) {
    return res.json({ error: "All fields must be required" });
  } else {
    try {
      let deleteProductObj = await Product.findById(pId);
      let deleteProduct = await Product.findByIdAndDelete(pId);
      if (deleteProduct) {
        // Delete Image from uploads -> products folder
        pdeleteImages(deleteProductObj.pImages, "string");
        return res.json({ success: "Product deleted successfully" });
      }
    } catch (err) {
      console.log(err);
    }
  }
});

router.get("/get-all-orders", async (req, res, next) => {
  try {
    let Orders = await Order.find({})
      .populate("orderItems.id","pName pPrice")
      .populate("user", "first_name last_name email")
      .sort({ _id: -1 });
    if (Orders) {
      return res.json({ Orders });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/update-order-status", async (req, res, next) => {
  let { oId, status } = req.body;
  console.log(req.body);
  if (!oId || !status) {
    return res.json({ message: "All fields must be required" });
  } else {
    let currentOrder = Order.findByIdAndUpdate(oId, {
      status: status,
      updatedAt: Date.now(),
    });
    currentOrder.exec((err, result) => {
      if (err) console.log(err);
      return res.json({ success: "Order updated successfully" });
    });
  }
});

module.exports = router;
