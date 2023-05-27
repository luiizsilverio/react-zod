import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { supabase } from "./lib/supabase";

function capitalize(text: string) {
  return text.trim().split(' ').map(word => {
    return word[0].toLocaleUpperCase().concat(word.substring(1))
  }).join(' ');
}

const techSchema = z.object({
  title: z.string().nonempty('O título é obrigatório'),
  knowledge: z.coerce.number().min(1).max(10)
})

const userSchema = z.object({
  avatar: z.instanceof(FileList)
    .transform(list => list.item(0)!) // ao invés de retornar um array, retorna a primeira imagem
    .refine(file => file!.size <= 2 * 1024 * 1024, 'Imagem muito grande'), // aceita imagens de até 2MB
  name: z.string()
    .nonempty('Nome obrigatório')
    .transform(name => capitalize(name)),
  email: z.string()
    .nonempty('E-mail obrigatório')
    .email('E-mail inválido')
    .toLowerCase()
    .refine(email => email.endsWith('@gmail.com'), 'Somente será aceita conta do GMail'),
  password: z.string()
    .min(6, 'A senha precisa de no mínimo 6 caracteres'),
  techs: z.array(techSchema)
    .min(2, 'Insira pelo menos 2 tecnologias')
    .refine(techs => {
      return techs.some(tech => tech.knowledge > 5)
    }, 'Você ainda não possui conhecimento suficiente!')
})

type UserFormData = z.infer<typeof userSchema>


function App() {
  const { register, handleSubmit, control, formState: {errors} } = useForm<UserFormData>({
    resolver: zodResolver(userSchema)
  });

  const { fields, append } = useFieldArray({
    control,
    name: 'techs'
  })

  function addNewTech() {
    append({ title: '', knowledge: 0 });
  }

  async function submitHandler(data: UserFormData) {
    await supabase.storage.from('imagens').upload(
      data.avatar.name,
      data.avatar
    );

    console.log(data);
  }

  return (
    <main className="h-screen bg-zinc-50 flex flex-col gap-10 items-center justify-center">
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="flex flex-col gap-4 w-full max-w-sm"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="avatar">Avatar</label>
          <input
            type="file"
            id="avatar"
            accept="image/*"
            className="border border-zinc-200 shadow-sm rounded h-10 px-3"
            {...register("avatar")}
          />
          {
            errors.avatar &&
              <span className="text-red-600 text-xs">{errors.avatar.message}</span>
          }
        </div>

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
              <span className="text-red-600 text-xs">{errors.name.message}</span>
          }
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email">E-mail (somente GMail)</label>
          <input
            type="email"
            id="email"
            className="border border-zinc-200 shadow-sm rounded h-10 px-3"
            {...register("email", { required: true })}
          />
          {
            errors.email &&
            <span className="text-red-600 text-xs">{errors.email.message}</span>
          }
        </div>

        <div className="flex flex-col flex-1 gap-1">
          <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              className="border border-zinc-200 shadow-sm rounded h-10 px-3"
              {...register("password", { required: true })}
            />
            {
              errors.password &&
              <span className="text-red-600 text-xs">{errors.password.message}</span>
            }
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="" className="flex items-center justify-between">
            Tecnologias / Conhecimento de 1 a 10
            <button type="button" onClick={addNewTech} className="text-emerald-500 text-xs">
              Adicionar
            </button>
          </label>
          {
            fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <div className="flex flex-1 flex-col gap-1">
                  <input
                    type="text"
                    className="flex-1 border border-zinc-200 shadow-sm rounded h-10 px-3"
                    {...register(`techs.${index}.title`)}
                  />
                  {
                    errors.techs?.[index]?.title &&
                      <span className="text-red-600 text-xs">
                        {errors.techs?.[index]?.title?.message}
                      </span>
                  }
                </div>

                <div className="flex flex-col gap-1">
                  <input
                    type="number"
                    className="w-16 border border-zinc-200 shadow-sm rounded h-10 px-3"
                    {...register(`techs.${index}.knowledge`)}
                  />
                </div>
                {
                  errors.techs?.[index]?.knowledge &&
                    <span className="text-red-600 text-xs">
                      {errors.techs?.[index]?.knowledge?.message}
                    </span>
                }
              </div>
            ))
          }
          { /* validação no array como um todo (mínimo de 2 tecnologias) */
            errors.techs &&
              <span className="text-red-600 text-xs">
                {errors.techs.message}
              </span>
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
