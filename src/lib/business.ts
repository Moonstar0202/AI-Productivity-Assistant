import { z } from 'zod';
import s0 from '@/assets/style-0.jpg';import s1 from '@/assets/style-1.jpg';import s2 from '@/assets/style-2.jpg';import s3 from '@/assets/style-3.jpg';
export const images=[s0,s1,s2,s3];
export const categories=['Client Appointments','Hair Preparation','Products and Supplies','Business Marketing','Payments and Finances','Personal Tasks'];
export const taskSchema=z.object({title:z.string().trim().min(1).max(150),description:z.string().max(2000),category:z.enum(['Client Appointments','Hair Preparation','Products and Supplies','Business Marketing','Payments and Finances','Personal Tasks']),due_date:z.string().nullable(),priority:z.enum(['High','Medium','Low']),status:z.enum(['Pending','In Progress','Completed'])});
export const bookingSchema=z.object({customer_name:z.string().trim().min(1).max(100),phone:z.string().regex(/^\+?[0-9]{10,15}$/,'Use 10–15 digits, with an optional +'),service_id:z.string().uuid(),appointment_date:z.string().min(10),appointment_time:z.string().min(5),hair_length:z.string().min(1).max(100),requirements:z.string().max(2000),notes:z.string().max(2000),house_call:z.boolean()});
export function whatsapp(text:string){return `https://wa.me/27747602949?text=${encodeURIComponent(text.slice(0,4000))}`}
export function today(){return new Date().toLocaleDateString('en-CA',{timeZone:'Africa/Johannesburg'})}
export function overdue(task:{due_date:string|null,status:string}){return !!task.due_date&&task.due_date<today()&&task.status!=='Completed'}
export function meta(title:string,description:string){return {meta:[{title:`${title} | Braiding By Me`},{name:'description',content:description},{property:'og:title',content:`${title} | Braiding By Me`},{property:'og:description',content:description},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}}
