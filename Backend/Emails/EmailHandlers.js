import { mailtrapClient,sender } from "../Lib/Mailtrap.js";
import { 
    createCommentNotificationEmailTemplate, 
    createConnectionAcceptedEmailTemplate,      
    createWelcomeEmailTemplate 
} from "./EmailTemplates.js";

export const sendWelcomeEmail = async (email, name, profileUrl) => {
    const recepient= [{email}]
    
    try{
        const response = await mailtrapClient.send({
            from:sender,
            to:recepient,
            subject:"welcome to UnLinked",
            html: createWelcomeEmailTemplate(name, profileUrl),
            category:"welcome"
        });

        console.log("Welcome email send successfully", response);
    }catch (error){
        throw error;
    }
};

export const sendCommentNotificationEmail = async (
    recepientEmail,
    recepientName,
    commenterName,
    postUrl,
    commentContent
) => {
    const recepient = [{email : recepientEmail}];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recepient,
            subject: "New Comment On your Post",
            html:createCommentNotificationEmailTemplate(
                recepientName, 
                commenterName,
                postUrl, 
                commentContent
            ),
            category: "comment_notification",
        });
        console.log("Comment Notification mail send Succssfully", response);
    } catch (error) {
        throw error
    }
};

export const sendConnectionAcceptedEmail = async (
    senderEmail,
    senderName,
    recipientname,
    profileUrl
) => {
    const recepient = [{email : senderEmail}];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recepient,
            subject:`${recipientname} accepted your connection request!`,
            html: createConnectionAcceptedEmailTemplate(senderName, recipientname, profileUrl),
            category: "connection_accepted",
        })
    } catch (error) {
        
    }
}