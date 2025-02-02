import { eq } from "drizzle-orm";
import { user } from "../../schema.js";
import { db } from "../db.js";


export const findUserOrAdd = async (userEmail: string, userName: string) => {
    let userObj = await db.select().from(user).where(eq(user.email, userEmail)).execute();
    
    // if userObj does not exists, then lets go ahead to make it
    if (userObj.length === 0) {
      await db.insert(user).values({ email: userEmail, name: userName});
      userObj = await db.select().from(user).where(eq(user.email, userEmail)).execute();
    }
}