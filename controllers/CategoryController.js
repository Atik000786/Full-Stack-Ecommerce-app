import slugify from "slugify";
import CategoryModel from "../models/CategoryModel.js";
// create - category.
export const createCategoryController= async(req,res)=>{
    try{
      const {name}=req.body;
      if(!name){
        res.status(401).send({
          success:false,
          message:"name is require",
        });
      }
      const existingCategory= await CategoryModel.findOne({name});
      if(existingCategory){
        res.status(200).send({
            success:true,
            message:"already exist category"
        })
      }
      const category= await new CategoryModel({
        name,
        slug:slugify(name),
      }).save();
      res.status(200).send({
        success:true,
        message:"successfully category created",
        category
      })
    }catch(err){
        console.log(err);
        res.status(500).send(
            {
               success:false,
               message:"some-thing going wrong"
            }
        )
    }
}
// update Category
 export const UpdateCategoryController= async (req,res)=>{
     try{
        const {name}=req.body;
        const {id}=req.params;
        const category=await CategoryModel.findByIdAndUpdate(
            id,
            {name,slug:slugify(name)},
            {new:true});
          res.status(200).send({
            success:true,
            message:"successfully category update",
            category
          });  
     }catch(err){
        console.log(err);
        res.status(401).send({
           success:true,
           message:"error while category updatation"
        });
     }
 }
 // select all category.
 export const categoryController= async (req,res)=>{
    try{
       const category = await CategoryModel.find({});
       res.status(200).send({
        success:true,
        message:"successfully selected all category",
        category
       })
    }catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            message:"error while reading all category",
            err
        })
    }
 }
 // select one category.
 export const singleCategoryController = async (req, res) => {
    try {
      const category = await CategoryModel.findOne({ slug: req.params.slug });
      res.status(200).send({
        success: true,
        message: "Get SIngle Category SUccessfully",
        category,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error While getting Single Category",
      });
    }
  };
  //delete category
export const deleteCategoryController = async (req, res) => {
    try {
      const { id } = req.params;
      await CategoryModel.findByIdAndDelete(id);
      res.status(200).send({
        success: true,
        message: "Categry Deleted Successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "error while deleting category",
        error,
      });
    }
  };