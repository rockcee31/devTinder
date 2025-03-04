
const validateProfileEdit = (req) =>{
    const allowedUpdates = ["age","skills","gender"];
    const allowed = Object.keys(req.body).every((key)=> allowedUpdates.includes(key))
     if(!allowed){
        throw new Error("cannot edit somee fields")
     }
}