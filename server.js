import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import morgan from "morgan";
import authRoute from "./routes/authRoute.js"; 
import { registerController , loginController, testController, forgotPasswordController, updateProfileController, getOrdersController, getAllOrdersController, updateStatusController} from "./controllers/authController.js";
import { isAdmin, requireSignIn } from "./middlewares/authMiddlewares.js";
import cors from "cors";
import { UpdateCategoryController, categoryController, createCategoryController,
   deleteCategoryController, singleCategoryController } from "./controllers/CategoryController.js";
import { BraintreePaymentController, BraintreeTokenController, createProductController, deleteProductController, filterProductController, 
  getProductByCategoryController, 
  getProductController, getSingleProductController, 
  productListController, 
  productPhotoController, 
  prouductCountController, 
  relatedProductController, 
  searchProductController, updateProductController } from "./controllers/ProductController.js";
import formidable from "express-formidable";
// configring .env file.s
dotenv.config();
//configer database

connectDB();
const PORT=  process.env.PORT || 8080;
const app=express();
// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routing
app.use("api/v1/auth",authRoute);

// res api
app.get("/",(req,res)=>{
     res.send("<h1>E-commerce full stack MERN web app</h1>");
});

// post request for registeration.
app.post("/register",registerController);

// post request log in.
app.post("/login",loginController)

// reset password || post request for forgot password.
app.post("/forgot-password",forgotPasswordController);

// get request for route protected
app.get("/test",requireSignIn,isAdmin,testController);

// user protect private routes.
app.get("/user-auth",requireSignIn,(req,res)=>{
    res.status(200).send({ok:true});
});

// Admin protect route.
app.get("/admin-auth",requireSignIn,isAdmin,(req,res)=>{
    res.status(200).send({ok:true});
});

// create category || post request for category
app.post("/create-category",requireSignIn,isAdmin,createCategoryController,(req,res)=>{
         res.status(200).send("category created");
});

// updete in category || put request for category.
app.put("/update-category/:id",requireSignIn,isAdmin,UpdateCategoryController);

// get all category || get request for all category.
app.get("/get-category",categoryController);

// get single category .
app.get("/single-category/:slug",singleCategoryController);

// Delete category.
app.delete("/delete-category/:id",requireSignIn,isAdmin,deleteCategoryController);

//create -product
app.post(
    "/create-product",
    requireSignIn,
    isAdmin,
    formidable(),
    createProductController,
  );
  // update- product
  app.put(
    "/update-product/:pid",
    requireSignIn,
    isAdmin,
    formidable(),
    updateProductController,
  );
  
  //get products
  app.get("/get-product", getProductController);
  
  //single product
  app.get("/get-product/:slug", getSingleProductController);
  
  //get photo
  app.get("/product-photo/:pid", productPhotoController);
  
  //delete product
  app.delete("/product/:pid", deleteProductController);
  
  // filtered product.
  app.post("/product-filter",filterProductController);

  // count total products
  app.get("/product-count",prouductCountController);
  
  // product list controller in per-page
  app.get("/product-list/:page",productListController);
  
  // search products.
  app.get("/search/:keyword",searchProductController);

  // get smillar products
  app.get("/related-product/:pid/:cid",relatedProductController);
  // get product by category.
  app.get("/product-category/:slug",getProductByCategoryController);
  // update profile.
  app.put("/profile",requireSignIn,updateProfileController);

  // payment gatway.
  // get token.
  app.get("/braintree/token",BraintreeTokenController);

  // post request for payment.
  app.post("/braintree/payment",requireSignIn,BraintreePaymentController);
   
  //get All Orders.
  app.get("/get-orders" ,requireSignIn,getOrdersController);

  //get all Orders for Amdin
  app.get("/all-orders",requireSignIn,isAdmin,getAllOrdersController);

  // update status.
  app.put("/update-status/:orderId",requireSignIn,isAdmin,updateStatusController);
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT} and ${process.env.Dec_server}`);
});