import test from "ava"
import { migrate } from "drizzle-orm/libsql/migrator"
import { db } from "../src/app.js"
import { todosTable } from "../src/schema.js"
import { getTodoById, removeTodoById, updateTodoById, toggleTodoById, insertTodo, findTodoByTitle } from "../src//db.js"

test.before("run migrations", async () => {
    await migrate(db, { migrationsFolder: "drizzle" })
})

test.beforeEach(async () => {
    await db.delete(todosTable)
})

test("removeTodoById", async (t) => {
    const title = "to-remove"
    await insertTodo(db, title)
    const todo = await findTodoByTitle(db, title)
    await removeTodoById(db, todo.id)
    const after = await findTodoByTitle(db, title)
    t.falsy(after)
})

test("updateTodoById", async (t) => {
    const title = "to-update"
    await insertTodo(db, title)
    const todo = await findTodoByTitle(db, title)
    await updateTodoById(db, todo.id, "updated-title", "low")
    const updated = await findTodoByTitle(db, "updated-title")
    t.is(updated.title, "updated-title")
    t.is(updated.priority, "low")
})

test("toggleTodoById", async (t) => {
    const title = "toggle-me"
    await insertTodo(db, title)
    const todo = await findTodoByTitle(db, title)
    t.false(todo.done)
    await toggleTodoById(db, todo.id)
    const toggled = await findTodoByTitle(db, title)
    t.true(toggled.done)
})

test("insertTodo inserts correctly", async (t) => {
    const title = "inserted"
    await insertTodo(db, title)
    const todo = await findTodoByTitle(db, title)
    t.truthy(todo)
    t.is(todo.title, title)
})

test("findTodoByTitle finds correct todo", async (t) => {
    const title = "find-me"
    await insertTodo(db, title)
    const todo = await findTodoByTitle(db, title)
    t.truthy(todo)
    t.is(todo.title, title)
})

test("getTodoById finds correct todo", async (t) => {
    const title = "get-by-id"
    await insertTodo(db, title)
    const inserted = await findTodoByTitle(db, title)
    const todo = await getTodoById(db, inserted.id)
    t.truthy(todo)
    t.is(todo.id, inserted.id)
    t.is(todo.title, title)
})