"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  HelpCircle,
  ChevronDown,
  MessageCircle,
  Shield,
  Users,
  Gamepad2,
  AlertTriangle,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Title from "@/app/components/Title/Title";
import { cn } from "@/lib/utils";
import Badge from "@/app/components/Shared/Badge/Badge";
import PageHero from "@/app/components/Shared/PageHero/PageHero";

const FAQPage = () => {
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [openQuestions, setOpenQuestions] = useState<string[]>([]);

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const toggleQuestion = (questionId: string) => {
    setOpenQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId],
    );
  };

  const faqData = [
    {
      id: "general",
      icon: <HelpCircle className="h-5 w-5 text-primary" />,
      category: "Общие правила",
      questions: [
        {
          id: "general-1",
          q: "Какие общие требования к участникам турниров?",
          a: "Участники должны соответствовать следующим требованиям:\n• Возраст 18+;\n• Наличие аккаунта в Discord;\n• Подключение к нашему Discord-серверу на момент проведения турнира.",
        },
        {
          id: "general-2",
          q: "Как происходит регистрация на турнир?",
          a: 'Регистрация происходит через сайт. При первой регистрации на сайте пользователю будет присвоена роль "Гость". \nДля получения роли "Участник", требуется сообщить о своей регистрации администратору, либо через знакомых, чей контакт есть у администрации. Данная система разработана для избежания участия незнакомых людей, твинков и т.п.',
        },
        {
          id: "general-3",
          q: "Нужно ли оплачивать участие в турнирах?",
          a: "На данный момент турниры проводятся без вступительного взноса.",
        },
        {
          id: "general-4",
          q: "Можно ли записывать или стримить матчи?",
          a: "Да, не запрещено записывать матчи или стримить их на любых площадках. Рекомендуется поставить минимальную задержку во избежание эксплуатации информации соперниками.",
        },
      ],
    },
    {
      id: "matches",
      icon: <Gamepad2 className="h-5 w-5 text-primary" />,
      category: "Правила проведения матчей",
      questions: [
        {
          id: "matches-1",
          q: "Как проводятся турниры?",
          a: "Все турниры проводятся с индивидуальными правилами. Обязательно ознакомьтесь с регламентом перед началом.",
        },
        {
          id: "matches-2",
          q: "Можно ли выбирать соперников?",
          a: "Составлением турнирной сетки занимается администрация. Запрещается намеренное искажение информации о своем игровом опыте, ранге или навыках с целью попасть в более слабую группу противников или усыпить бдительность соперника. Администрация оставляет за собой право дисквалифицировать участников за нечестную игру.",
        },
        {
          id: "matches-3",
          q: "Что делать в случае технических проблем?",
          a: "Немедленно сообщите администратору или судьям турнира в Discord. Для оперативного решения вопроса, технические проблемы должны фиксироваться скриншотами или записями экрана. Решение о переигровке принимает администрация.",
        },
        {
          id: "matches-4",
          q: "Условия старта турнира",
          a: "Для запуска турнира необходимо выполнение следующих условий:\n\n• Минимум 50% участников должны зарегистрироваться\n• Все игроки обязаны состоять в Discord канале на момент старта\n• Капитаны команд должны подтвердить готовность в указанное время начала турнира\n\nЕсли порог в 50% не достигнут, турнир переносится или отменяется. Администрация оповещает всех зарегистрированных участников в Discord за 24 часа до предполагаемого старта.",
        },
        {
          id: "matches-5",
          q: "Кто может стать судьей?",
          a: "Судьи назначаются на каждый турнир администрацией.",
        },
      ],
    },
    {
      id: "admin",
      icon: <Shield className="h-5 w-5 text-primary" />,
      category: "Права администрации",
      questions: [
        {
          id: "admin-1",
          q: "Могут ли администраторы удалить команду или игрока из турнира?",
          a: "Да, администраторы имеют полное право удалять команды или игроков из турнира в случае нарушения правил, предоставления недостоверных данных или без объяснения причин, если администрация сочтет нужным.",
        },
        {
          id: "admin-2",
          q: "За что могут дисквалифицировать участников?",
          a: "Администрация имеет полное право дисквалифицировать участников турнира за:\n• Использование читов и запрещенного ПО\n• Неспортивное поведение\n• Договорные матчи\n• Любые другие нарушения, мешающие проведению турнира\n• На усмотрение администрации/судей",
        },
      ],
    },
    {
      id: "discord",
      icon: <MessageCircle className="h-5 w-5 text-primary" />,
      category: "Discord и коммуникация",
      questions: [
        {
          id: "discord-1",
          q: "Обязательно ли состоять в Discord-канале?",
          a: "Да! Все пользователи должны обязательно состоять в Discord-канале на момент проведения турнира. Это критически важно для коммуникации с администрацией, получения расписания и решения организационных вопросов.",
        },
        {
          id: "discord-2",
          q: "В каких каналах получать информацию?",
          a: "Основной канал для информации: #анонсы. Дополнительные каналы, относящиеся к конкретному турниру, могут быть созданы перед турниром. Убедитесь, что у вас включены уведомления в этих каналах.",
        },
      ],
    },
    {
      id: "age",
      icon: <Users className="h-5 w-5 text-primary" />,
      category: "Возрастные ограничения",
      questions: [
        {
          id: "age-1",
          q: "Почему турниры только для 18+?",
          a: "Турниры проводятся только для участников старше 18 лет в соответствии с законодательством и правилами игровых платформ. Это также помогает поддерживать более зрелую и ответственную атмосферу.",
        },
      ],
    },
    {
      id: "conduct",
      icon: <AlertTriangle className="h-5 w-5 text-primary" />,
      category: "Поведение и санкции",
      questions: [
        {
          id: "conduct-1",
          q: "Наказание за использование читов",
          a: "Если судья, наблюдающий за игрой, обнаружит, что кто-то из участников использует программы, дающие преимущество перед соперником (читы, lagger'ы и т.д.), участник будет немедленно дисквалифицирован и заблокирован для участия в дальнейших турнирах. Команда такого игрока также подлежит дисквалификации, а все результаты матчей с его участием аннулируются. На данный момент турниры проводятся на дружественной основе, поэтому любое использование запрещенных программ исключено.",
        },
        {
          id: "conduct-2",
          q: "Токсичность на турнире",
          a: "Под токсичностью понимается создание враждебной атмосферы между участниками, судьями либо администрацией. Не запрещено выражать эмоции или поддерживать напряжение между командами, но всегда нужно придерживаться границ друг друга. За токсичное поведение предусмотрены санкции: от предупреждения до дисквалификации с турнира. Администраторы имеют полное право дисквалифицировать участников турнира за проявление токсичности без предварительных предупреждений.",
        },
        {
          id: "conduct-3",
          q: "Можно ли использовать баги игры?",
          a: "Индивидуально описывается в регламенте каждого турнира.",
        },
      ],
    },
    {
      id: "rewards",
      icon: <Trophy className="h-5 w-5 text-primary" />,
      category: "Награды за победу в турнирах",
      questions: [
        {
          id: "rewards-1",
          q: "Какая награда выдается за победу в турнире?",
          a: "Награда за победу указывается на странице турнира. Тип награды определяется организатором турнира.",
        },
        {
          id: "rewards-2",
          q: "Как получить награду?",
          a: "После победы в турнире, организатор свяжется с Вами в Discord. Если вы не получили сообщение, свяжитель с организатором самостоятельно. Победитель несет ответственность за правильность указанных данных/реквизитов для получения награды. Награда может быть получена в течение 3-х суток.",
        },
      ],
    },
  ];

  return (
    <main className="max-w-5xl mx-auto w-full px-4 py-8">
      <PageHero
        title="FAQ"
        description="Часто задаваемые вопросы о турнирах, правилах участия и полномочиях
            администрации"
        icon={<HelpCircle className="h-8 w-8 text-primary" />}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-wrap gap-2 mb-8"
      >
        {faqData.map((category) => (
          <button
            key={category.id}
            onClick={() => toggleCategory(category.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300",
              openCategories.includes(category.id)
                ? "border-primary bg-primary/10 neon-border"
                : "border-border bg-background hover:border-primary/50 hover:bg-muted/50",
            )}
          >
            {category.icon}
            <span className="text-sm font-medium">{category.category}</span>
          </button>
        ))}
      </motion.div>

      <div className="space-y-4">
        <AnimatePresence>
          {faqData.map((category, categoryIndex) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 * (categoryIndex + 1) }}
              className="rounded-2xl border border-border bg-background overflow-hidden"
            >
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between p-6 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center neon-border">
                    {category.icon}
                  </div>
                  <h2 className="text-xl font-bold text-foreground">
                    {category.category}
                  </h2>
                </div>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 text-muted-foreground transition-transform duration-300",
                    openCategories.includes(category.id) && "rotate-180",
                  )}
                />
              </button>

              <AnimatePresence>
                {openCategories.includes(category.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      duration: 0.3,
                      ease: [0.04, 0.62, 0.23, 0.98],
                    }}
                    className="border-t border-border overflow-hidden"
                  >
                    {category.questions.map((item) => (
                      <div
                        key={item.id}
                        className="border-b border-border last:border-b-0"
                      >
                        <button
                          onClick={() => toggleQuestion(item.id)}
                          className="w-full flex items-center justify-between p-6 hover:bg-muted/30 transition-colors"
                        >
                          <span className="text-left font-medium text-foreground">
                            {item.q}
                          </span>
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 text-muted-foreground transition-transform duration-300 ml-4 shrink-0",
                              openQuestions.includes(item.id) && "rotate-180",
                            )}
                          />
                        </button>

                        <AnimatePresence initial={false}>
                          {openQuestions.includes(item.id) && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{
                                duration: 0.3,
                                ease: [0.04, 0.62, 0.23, 0.98],
                              }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-6">
                                <div className="pl-4 border-l-2 border-primary/50">
                                  <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                                    {item.a}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-8 rounded-2xl border border-primary/30 bg-primary/5 p-6"
      >
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center neon-border shrink-0">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground mb-2">Важно!</h3>
            <p className="text-muted-foreground mb-4">
              Администрация турнира оставляет за собой право вносить изменения в
              правила, дисквалифицировать участников и принимать решения в
              спорных ситуациях. Участники турнира могут быть дисквалифицированы
              или удалены без объяснения причин. Администрация турнира не несёт
              ответственности за любые последствия участия, включая технические
              неполадки, ошибки программного обеспечения, действия третьих лиц,
              а также за любые убытки, прямой или косвенный ущерб, связанный с
              проведением соревнований. Участие в турнире означает полное
              согласие с данными правилами.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge
                text="18+"
                className="flex items-center justify-center bg-red-500/10 text-red-400 border border-red-500/30! text-sm"
              />
              <Badge
                text="Discord"
                className="flex items-center justify-center bg-blue-500/10 text-blue-400 border border-blue-500/30! text-sm"
              />
              <Badge
                text="Fair Play"
                className="flex items-center justify-center bg-yellow-500/10 text-yellow-400 border border-yellow-500/30! text-sm"
              />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="mt-8 text-center"
      >
        <p className="text-muted-foreground mb-4">Остались вопросы?</p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors neon-border"
        >
          <span>Связаться с администрацией</span>
          <span>→</span>
        </Link>
      </motion.div>
    </main>
  );
};

export default FAQPage;
