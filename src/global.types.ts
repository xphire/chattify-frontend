export interface User{
    _id : string;
    email : string;
    profilePic : string,
    firstName : string,
    lastName : string,
    createdAt : string
}


export interface Message{
    _id : string;
    image: string;
    text: string;
    senderId : string;
    receiverId : string;
    createdAt : string
}