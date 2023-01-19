import dayjs from 'dayjs';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/';

const createHabitBody = z.object({
  title: z.string(),
  weekDays: z.array(
    z.number().min(0).max(6),
  ),
});

const getDayParams = z.object({
  date: z.coerce.date(), // transforma info string em date
});

export async function routes(app: FastifyInstance) {
  app.post('/habits', async (req) => {
    const { title, weekDays } = createHabitBody.parse(req.body);

    const today = dayjs().startOf('day').toDate();
    await prisma.habit.create({
      data:{
        title,
        created_at: today,
        habitWeekDays: {
          create: weekDays.map(weekDay => ({
            week_day: weekDay,
          })),
        },
      },
    });
  });

  app.get('/day', async (req)=> {
    const { date } = getDayParams.parse(req.query);
    const parsedDate = dayjs(date).startOf('day');
    const weekDay = dayjs(date).get('day');
    const possibleHabits = await prisma.habit.findMany({
      where: {
        created_at: {
          lte: date,
        },
        habitWeekDays: {
          some: {
            week_day: weekDay,
          },
        },
      },
    });

    const day = await prisma.day.findUnique({
      where: {
        date: parsedDate.toDate(),
      },
      include: {
        dayHabits: true,
      }
    });

    const completedHabits = day?.dayHabits.map(dayHabit => dayHabit.id);

    return {
      possibleHabits,
      completedHabits
    }
  })
}