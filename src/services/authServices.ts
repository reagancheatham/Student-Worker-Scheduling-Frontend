import { DatabaseServices } from "@classes/util/databaseServices";
import { router } from "../routing/router";
import { User } from "@classes/User";

const API_ROOT: string = "authentication/";

export class AuthServices {
  static async login(token: string) {
    const result = await DatabaseServices.create(API_ROOT, {
      credential: token,
    });

    if ((result.valid = true)) {
      const user = new User(
        result.user.id,
        result.user.studentID,
        result.user.permissionRoleID,
        result.user.firstName,
        result.user.lastName,
        result.user.email,
        result.user.phoneNumber,
        result.token,
        result.profilePicture,
      );
      localStorage.setItem(
        "user",
        JSON.stringify(user),
      );

      router.push("/dashboard");
    } else {
      console.error("Login failed: invalid credentials");
    }
  }
}
