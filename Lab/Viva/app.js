const express=require("express");
const path=require("path");
const {MongoClient,ObjectId}=require("mongodb");

const app=express();
const PORT=3000;
const MONGO_URL="mongodb://127.0.0.1:27017";
const DB_NAME="cms_lab";

let postsCollection;

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));

app.locals.formatDateTime=(date)=>{
    if(!date)return "";
    return new Date(date).toLocaleString("en-GB",{
        day:"numeric",
        month:"long",
        year:"numeric",
        hour:"2-digit",
        minute:"2-digit",
        second:"2-digit",
        hour12:true
    });
};

app.get(["/","/posts"],async(req,res)=>{
    try{
        const search=(req.query.search||"").trim();
        const filter=search
            ? {$or:[
                {title:{$regex:search,$options:"i"}},
                {author:{$regex:search,$options:"i"}},
                {content:{$regex:search,$options:"i"}}
            ]}
            : {};

        const posts=await postsCollection.find(
            filter,
            {projection:{content:0}}
        ).sort({createdAt:-1}).toArray();

        res.render("posts",{posts,search});
    }catch(error){
        console.error(error);
        res.status(500).send("Database error occurred.");
    }
});

app.get("/posts/new",(req,res)=>{
    res.render("new-post",{
        error:"",
        title:"",
        author:"",
        content:"",
        edit:false,
        postId:""
    });
});

app.post("/posts",async(req,res)=>{
    const title=(req.body.title||"").trim();
    const author=(req.body.author||"").trim();
    const content=(req.body.content||"").trim();

    if(!title||!content||!author){
        return res.status(400).render("new-post",{
            error:"Title, Content and Author are required.",
            title,
            author,
            content,
            edit:false,
            postId:""
        });
    }

    try{
        await postsCollection.insertOne({
            title,
            content,
            author,
            createdAt:new Date(),
            updatedAt:null
        });

        res.redirect("/posts");
    }catch(error){
        console.error(error);
        res.status(500).send("Error saving post to database.");
    }
});

app.get("/posts/:id/edit",async(req,res)=>{
    try{
        const {id}=req.params;

        if(!ObjectId.isValid(id)){
            return res.status(400).send("Invalid post ID.");
        }

        const post=await postsCollection.findOne({
            _id:new ObjectId(id)
        });

        if(!post){
            return res.status(404).send("Post not found.");
        }

        res.render("new-post",{
            error:"",
            title:post.title,
            author:post.author,
            content:post.content,
            edit:true,
            postId:post._id
        });
    }catch(error){
        console.error(error);
        res.status(500).send("Error loading post for editing.");
    }
});

app.post("/posts/:id/edit",async(req,res)=>{
    const {id}=req.params;
    const title=(req.body.title||"").trim();
    const author=(req.body.author||"").trim();
    const content=(req.body.content||"").trim();

    if(!ObjectId.isValid(id)){
        return res.status(400).send("Invalid post ID.");
    }

    if(!title||!content||!author){
        return res.status(400).render("new-post",{
            error:"Title, Content and Author are required.",
            title,
            author,
            content,
            edit:true,
            postId:id
        });
    }

    try{
        const result=await postsCollection.updateOne(
            {_id:new ObjectId(id)},
            {
                $set:{
                    title,
                    author,
                    content,
                    updatedAt:new Date()
                }
            }
        );

        if(result.matchedCount===0){
            return res.status(404).send("Post not found.");
        }

        res.redirect(`/posts/${id}`);
    }catch(error){
        console.error(error);
        res.status(500).send("Error updating post.");
    }
});

app.post("/posts/:id/delete",async(req,res)=>{
    try{
        const {id}=req.params;

        if(!ObjectId.isValid(id)){
            return res.status(400).send("Invalid post ID.");
        }

        const result=await postsCollection.deleteOne({
            _id:new ObjectId(id)
        });

        if(result.deletedCount===0){
            return res.status(404).send("Post not found.");
        }

        res.redirect("/posts");
    }catch(error){
        console.error(error);
        res.status(500).send("Error deleting post.");
    }
});

app.get("/posts/:id",async(req,res)=>{
    try{
        const {id}=req.params;

        if(!ObjectId.isValid(id)){
            return res.status(400).send("Invalid post ID.");
        }

        const post=await postsCollection.findOne({
            _id:new ObjectId(id)
        });

        if(!post){
            return res.status(404).send("Post not found.");
        }

        res.render("post",{post});
    }catch(error){
        console.error(error);
        res.status(500).send("Error fetching post.");
    }
});

async function startServer(){
    try{
        const client=new MongoClient(MONGO_URL);
        await client.connect();

        const db=client.db(DB_NAME);
        postsCollection=db.collection("posts");

        console.log("Connected successfully to MongoDB");
        console.log(`Database: ${DB_NAME}`);
        console.log("Collection: posts");

        app.listen(PORT,()=>{
            console.log(`Server running at http://localhost:${PORT}`);
        });
    }catch(error){
        console.error("MongoDB connection failed:",error.message);
        process.exit(1);
    }
}

startServer();
