import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

function capitalize(text: string) {
  return text.trim().split(' ').map(word => {
    return word[0].toLocaleUpperCase().concat(word.substring(1))
  }).join(' ');
}

const userSchema = z.object({
  name: z.string()
    .nonempty('Nome obrigatório')
    .transform(name => capitalize(name)),
  email: z.string()
    .nonempty('E-mail obrigatório')
    .email('E-mail inválido')
    .toLowerCase()
    .refine(email => email.endsWith('@rocketseat.com.br'), 'E-mail incorreto'),
  password: z.string()
    .min(6, 'A senha precisa de no mínimo 6 caracteres'),
})

type UserFormData = z.infer<typeof userSchema>

function App() {
  const { register, handleSubmit, formState: {errors} } = useForm<UserFormData>({
    resolver: zodResolver(userSchema)
  });

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
          <label htmlFor="name">Nome</label>
          <input
            type="text"
            id="name"
            className="border border-zinc-200 shadow-sm rounded h-10 px-3"
            {...register("name", { required: true })}
          />
          {
            errors.name &&
              <span className="text-red-600">{errors.name.message}</span>
          }
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            className="border border-zinc-200 shadow-sm rounded h-10 px-3"
            {...register("email", { required: true })}
          />
          {
            errors.email &&
            <span className="text-red-600">{errors.email.message}</span>
          }
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            className="border border-zinc-200 shadow-sm rounded h-10 px-3"
            {...register("password", { required: true })}
          />
          {
            errors.password &&
            <span className="text-red-600">{errors.password.message}</span>
          }
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
