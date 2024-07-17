import OpenAI  from "openai";

const openai = new OpenAI({
    apiKey: "<YOUR OPENAI KEY>"
})


const assistant = "<YOUR OPENAI ASSISTANT_ID>"
const file = "<YOUR OPENAI FILE_ID>"

const delay = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };



export class BotController {

    public static async getReply(message: any){
        let thread
        /*for test purspose i am hard-code the thread_id. Better to use one thread_id for one user as openai docs.
          You can use your database for save the thread with user name match pair*/

        thread = "<YOUR OPENAI THREAD_ID>"
        const addMessage = await openai.beta.threads.messages.create(thread, {
            role: "user",
            content : message.text,
            attachments: [
                {
                    file_id: file,
                    tools: [{ type: "file_search" }],
                }
            ]
        })
        console.log("Message added", addMessage)

        let myRun = await openai.beta.threads.runs.create(thread,{
            assistant_id: assistant,
            instructions: "You are a customer support chatbot. Use your knowledge base to best respond to customer queries."
        })
        console.log("myRun", myRun)
        const reply = await this.getBotResponse(myRun, thread)
        if(reply){
            return reply
        }else{
            return "Can't find the answer"
        }

    }

    //function to response from openai
    public static async getBotResponse(myRun: any, thread: any){
        do{
            let keepRetrievingRun = await openai.beta.threads.runs.retrieve(
                thread,
                myRun.id
              );
            console.log(`Run status: ${keepRetrievingRun.status}`);


        if (keepRetrievingRun.status === "completed") {
            console.log("\n");
  
            // Retrieve the Messages added by the Assistant to the Thread
            const allMessages = await openai.beta.threads.messages.list(thread);
            console.log(
              "------------------------------------------------------------ \n"
            );
  
            // Find the latest assistant message
            const assistantMessage:any = allMessages.data.find(
              (msg) => msg.role === "assistant"
            );
  
            console.log("Assistant:", assistantMessage?.content[0]);
            return assistantMessage?.content[0].text.value
          } else if (
            keepRetrievingRun.status === "queued" ||
            keepRetrievingRun.status === "in_progress"
          ) {
            // Wait for 10 seconds before the next iteration
            await delay(10000)
          } else {
            console.log(`Run status: ${keepRetrievingRun.status}`);
            console.log(keepRetrievingRun)
            return "Failed to retrieve the run status";
          }
        }while(myRun.status === "queued" || myRun.status === "in_progress")
    }
}


