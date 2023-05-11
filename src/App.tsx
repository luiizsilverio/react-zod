import { useForm } from "react-hook-form";

function App() {
  const { register, handleSubmit, formState } = useForm();
  // const errors = formState.errors;

  function submitHandler(data: any) {
    console.log(data);
  }

  return (
    <main className="h-screen bg-zinc-50 flex flex-col gap-10 items-center justify-center">
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="flex flex-col gap-4 w-full max-w-sm"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            className="border border-zinc-200 shadow-sm rounded h-10 px-3"
            {...register("email", { required: true })}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            className="border border-zinc-200 shadow-sm rounded h-10 px-3"
            {...register("password", { required: true })}
          />
        </div>

        <button
          type="submit"
          className="bg-emerald-500 rounded font-semibold text-white h-10 hover:bg-emerald-600"
        >
          Salvar
        </button>
      </form>
    </main>
  )
}

export default App
