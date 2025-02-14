import { eq } from "drizzle-orm";
import { user } from "../../schema.js";
import { db } from "../db/index.js";

export const findUserOrAdd = async (userEmail: string, userName: string, type: "google" | "email") => {
    // Fetch the user from the database
    let userObj = await db.select().from(user).where(eq(user.email, userEmail)).execute();
    
    // If the user does not exist, create the user and return true
    if (userObj.length === 0) {
        await db.insert(user).values({ email: userEmail, name: userName, type });
        return true;
    }

    // If the user exists, check if the type matches
    const existingUser = userObj[0];
    if (existingUser.type !== type) {
        return false; // Return false if the type does not match
    }

    return true; // Return true if the type matches
};