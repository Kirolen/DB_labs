import { Request, Response } from "express";
import { UnitOfWork } from "../db/unitOfWork";

export class UserController {
  static async addUser(req: Request, res: Response) {
    const { username, email, password_hash, role } = req.body;
    const uow = await UnitOfWork.create();
    try {
      await uow.users.addUser(username, email, password_hash, role);
      await uow.commit();
      res.status(201).json({ message: "User added successfully" });
    } catch (err) {
      await uow.rollback();
      res
        .status(500)
        .json({ error: "Failed to add user", details: (err as Error).message });
    }
  }

  static async updateUser(req: Request, res: Response) {
    const { id, username, email, password_hash, role } = req.body;
    const uow = await UnitOfWork.create();
    try {
      await uow.users.updateUser(id, username, email, password_hash, role);
      await uow.commit();
      res.status(201).json({ message: "User updated successfully" });
    } catch (err) {
      await uow.rollback();
      res.status(500).json({
        error: "Failed to update user",
        details: (err as Error).message,
      });
    }
  }

  static async getUserById(req: Request, res: Response) {
    const { id } = req.params;
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    const uow = await UnitOfWork.create();
    try {
      const user = await uow.users.getUserById(userId);
      await uow.commit();
      res.status(201).json({ message: "User getting successfully", user });
    } catch (err) {
      await uow.rollback();
      res.status(500).json({
        error: "Failed to get user",
        details: (err as Error).message,
      });
    }
  }

  static async getUsers(req: Request, res: Response) {
    const uow = await UnitOfWork.create();
    try {
      const users = await uow.users.getUsers();
      await uow.commit();
      res.status(201).json({ message: "Users getting successfully", users });
    } catch (err) {
      await uow.rollback();
      res.status(500).json({
        error: "Failed to get users",
        details: (err as Error).message,
      });
    }
  }

  static async softDeleteUser(req: Request, res: Response) {
    const { id } = req.params;
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    const uow = await UnitOfWork.create();
    try {
      await uow.users.softDeleteUser(userId);
      await uow.commit();
      res.status(201).json({ message: "User deleted successfully"});
    } catch (err) {
      await uow.rollback();
      res.status(500).json({
        error: "Failed to delete user",
        details: (err as Error).message,
      });
    }
  }
}
