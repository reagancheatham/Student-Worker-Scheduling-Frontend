import { AvatarProps } from "@nuxt/ui";
import { DatabaseModel } from "./databaseModel.ts";

export class Employee extends DatabaseModel {
  constructor(
    public readonly id: number,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly phoneNumber: string,
    public readonly avatar: AvatarProps,
  ) {
    super();
  }

  public static async createFromData(data: any): Promise<Employee> {
    let user = data["User"];
    let firstName = user ? user.firstName : ("" as string);
    let lastName = user ? user.lastName : ("" as string);
    let email = user ? user.email : ("" as string);
    let phoneNumber = user ? user.phoneNumber : ("" as string);
    let avatar: AvatarProps = {
      src: "",
      alt: `${firstName} ${lastName}`,
    };

    if (email) {
      try {
        const storedUser = localStorage.getItem("user");
        let token: string | null = null;
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            token = parsedUser.token;
          } catch (err) {
            console.error(
              "Error parsing user from localStorage: " + JSON.stringify(err),
            );
            token = null;
          }
          const res = await fetch(
            `https://admin.googleapis.com/admin/directory/v1/users/${encodeURIComponent(email)}/photos/thumbnail`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (res.ok) {
            const json = await res.json();
            avatar.src = json.photoData
              ? `data:image/jpeg;base64,${json.photoData}`
              : "";
          } else {
            console.warn(`Avatar not found for ${email}:`, res.statusText);
          }
        }
      } catch (err) {
        console.error(`Error fetching avatar for ${email}:`, err);
      }
    }

    return new Employee(
      data["id"] ?? 0,
      firstName,
      lastName,
      email,
      phoneNumber,
      avatar,
    );
  }

  public get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
