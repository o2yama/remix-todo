import { Todo } from "@prisma/client";
import { Form, json, Link, useLoaderData } from "@remix-run/react";
import { FC } from "react";
import { getTodos } from "~/models/todo.server";

export const loader = async () => {
  return json({ todos: await getTodos() });
};

const Todos: FC = () => {
  const { todos } = useLoaderData<typeof loader>();

  const handleDeleteSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    todo: { id: string; title: string },
  ) => {
    if (window.confirm(`「${todo.title}」を削除しますか？`)) {
      fetch(`/todos/${todo.id}/delete`, { method: "POST" });
    }
  };

  return (
    <>
      <h2>Todo一覧画面</h2>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <Link to={`${todo.id}/edit`}>タイトル：{todo.title}</Link>
            <p>期限：{todo.deadline}</p>
            <p>進捗：{todo.isDone ? "完了" : "未着手"}</p>
            <Form onSubmit={(event) => handleDeleteSubmit(event, todo)}>
              <button type="submit">削除</button>
            </Form>
          </li>
        ))}
      </ul>
      <br />
      <Link to="create">追加する</Link>
    </>
  );
};

export default Todos;
