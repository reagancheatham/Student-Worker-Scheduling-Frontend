import { User } from "@classes/database/User";

export class ParseLocalStorage {
  static parseUser(): User | null{
    const storedUser = localStorage.getItem("user");
    let token: string | null = null;

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        return new User(
          user.id,
          user.studentID,
          user.permissionRoleID,
          user.firstName,
          user.lastName,
          user.email,
          user.phoneNumber,
          user.token,
          user.profilePicture,
        );
      } catch (err) {
        console.error("Error parsing user from localStorage:", err);
        return null
      }
    }
    return null
  }
}
