import { DatabaseModel } from "./databaseModel.ts";


export class Manager extends DatabaseModel {
  constructor(
    public readonly id: number,
    public readonly businessID: string,
    public readonly employeeID: string,
    public readonly isOwner: Boolean,
  ) {
    super();
  }

  public static createFromData(data: any): Manager {
    let id = data["id"];
    let businessID = data["businessID"];
    let employeeID = data["employeeID"];
    let isOwner = data["isOnwer"];

    return new Manager(id, businessID, employeeID, isOwner);
  }

}
