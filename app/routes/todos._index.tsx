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
    event.preventDefault();

    if (window.confirm(`「${todo.title}」を削除しますか？`)) {
      const form = event.target as HTMLFormElement;
      form.submit();
    }
  };

  return (
    <>
      <div className="flex items-center">
        <h2 className="px-2 text-4xl">Todo一覧画面</h2>
        <Link
          to="create"
          className="mx-4 inline-flex items-center justify-center space-x-2 py-2 px-4 border border-transparent text-sm font-medium rounded text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
              clip-rule="evenodd"
            />
          </svg>
          <div>追加</div>
        </Link>
      </div>
      <div className="px-2 space-y-4">
        <ul className="container mx-auto mt-8">
          {todos.map((todo) => (
            <li key={todo.id} className="my-4 flex items-start">
              <Link
                to={`${todo.id}/edit`}
                className="flex w-96 shadow-lg rounded-lg"
              >
                <div
                  className={`${todo.isDone ? "bg-blue-500" : "bg-red-500"}  px-1 rounded-l-lg flex items-center`}
                ></div>
                <div className="px-4 py-6 bg-white rounded-r-lg flex justify-between items-start w-full border border-l-transparent border-gray-200">
                  <div className="flex-col">
                    <h3>タイトル：{todo.title}</h3>
                    <p>期限：{todo.deadline}</p>
                    <p>進捗：{todo.isDone ? "完了" : "未着手"}</p>
                  </div>
                </div>
              </Link>
              <Form
                action={`${todo.id}/delete`}
                method="post"
                className="p-2"
                onSubmit={(e) => handleDeleteSubmit(e, todo)}
              >
                <button type="submit">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="fill-current text-gray-700"
                    viewBox="0 0 16 16"
                    width="20"
                    height="20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"
                    ></path>
                  </svg>
                </button>
              </Form>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Todos;
