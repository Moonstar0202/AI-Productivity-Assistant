# Braid Bliss Hq

# Project: Braiding By Me — Braiding Business Website & Productivity Dashboard

Build a beautiful, modern, responsive website for a hair-braiding business called **Braiding By Me**. Use the attached business flyer as the main reference for the business branding, hairstyle services, prices, location, contact details, and overall aesthetic.

The website should function as both a professional braiding business website and a productivity management dashboard that helps the business owner manage appointments, daily tasks, and business activities efficiently.

## 1. Design and Branding

Create an elegant, feminine, calming design using a coordinated **purple and pink colour scheme**.

Colour palette:
- Soft lavender: `#E6DDF5`
- Light blush pink: `#F7DCE8`
- Deep purple: `#563A70`
- Rose pink: `#D98BA8`
- White: `#FFFFFF`
- Dark mode background: `#17131F`
- Dark mode card background: `#251D30`

Design requirements:
- Use rounded cards, soft shadows, subtle gradients, and elegant typography.
- Use attractive script typography for headings and clean sans-serif fonts for body text.
- Include high-quality images of knotless braids, goddess braids, curly ends, and knotless twists.
- Use the supplied flyer and hairstyle photographs as visual references.
- Include subtle hair-braid patterns and decorative heart elements without overcrowding the interface.
- Ensure the website looks professional on mobile phones, tablets, and desktop computers.
- Create a consistent navigation menu with clear icons and readable text.
- Provide accessible colour contrast, keyboard navigation, and visible focus states.

Brand tagline: **Clean • Neat • Stylish**

Brand message: **Good Hair, Good Mood. Your Hair, My Passion.**

## 2. Homepage

Create a welcoming landing page with:
- A hero section featuring the Braiding By Me business name, tagline, and a beautiful braided-hairstyle image.
- A short introduction to the business.
- Prominent “Book an Appointment” and “View Price List” buttons.
- A featured hairstyles section with images and prices.
- A section highlighting quality braids, client satisfaction, and stylish results.
- A contact and location section.
- A footer with navigation links, WhatsApp contact, and business information.

## 3. Services and Price List

Display a clear, attractive price list based on the supplied flyer. Use South African rand (ZAR).

Services:
- Knotless braids — normal length: R250
- Knotless braids — normal length with curly ends: R280
- Knotless braids — short with curly ends: R200
- Knotless twists — normal length: R280
- Knotless twists — normal length with curly ends: R300
- Goddess braids — normal length: R350
- Short goddess braids: R250

Include a note: “Extra lengths may incur additional charges.”

Each service card should include a hairstyle image, service name, price, and a “Book This Style” button.

Make the services and prices easy to update later through an admin dashboard.

## 4. Appointment Booking System

Build a functional appointment booking interface with:
- Customer name and contact number.
- Selected hairstyle or service.
- Preferred appointment date and time.
- Hair length and additional requirements.
- Optional notes from the customer.
- Booking confirmation screen.
- Appointment status: Pending, Confirmed, Completed, or Cancelled.
- An appointment dashboard where the business owner can view, add, edit, reschedule, and cancel appointments.
- A calendar or agenda view showing upcoming bookings.
- Prevention of double-booking for the same available time slot.
- A WhatsApp booking button that opens a pre-filled message containing the customer's selected service and preferred appointment details.

Business information:
- Location: CPUT Bellville Campus, Cape Town.
- Phone/WhatsApp: 0747602949.
- House calls are available at an additional charge.

Do not claim that a booking has been confirmed until it has been saved successfully. If online booking storage or automated confirmation is not configured, clearly label the booking as a request.

## 5. Task Management Dashboard

Create a dedicated dashboard called **My Business Tasks** to help the braider organise daily work.

Required features:

### Add tasks
- Add a new task using a modal or form.
- Include task title, description, category, due date, priority, and status.
- Allow tasks to be edited and deleted.
- Validate required fields before saving.

### Mark tasks complete
- Add a checkbox beside every task.
- When checked, change the task status to “Completed”.
- Display completed tasks with a strikethrough title and a subtle visual distinction.
- Allow completed tasks to be marked incomplete again.
- Show a progress indicator for the percentage of tasks completed.

### Organise tasks by category
Create categories such as:
- Client Appointments
- Hair Preparation
- Products and Supplies
- Business Marketing
- Payments and Finances
- Personal Tasks

Allow users to select a category when creating a task and filter tasks by category.

### Task priorities and filters
- Priority levels: High, Medium, Low.
- Status filters: All, Pending, In Progress, Completed.
- Category filters.
- Search tasks by title.
- Sort by due date, priority, or creation date.
- Highlight overdue tasks.
- Display a summary of total tasks, pending tasks, completed tasks, and overdue tasks.

### Sample tasks
Preload a few editable example tasks:
- Confirm tomorrow's client appointments.
- Prepare braiding hair and styling products.
- Buy additional curly-end extensions.
- Post new hairstyle pictures on WhatsApp.
- Clean and organise the braiding workspace.
- Follow up with clients about outstanding bookings.

Clearly distinguish sample tasks from real appointments or customer information.

## 6. Dark Mode Toggle

Add a clearly visible light/dark mode toggle in the navigation bar or dashboard settings.

Requirements:
- Use a sun icon for light mode and a moon icon for dark mode.
- Switch the entire interface between light and dark themes.
- Ensure all text, forms, buttons, cards, menus, and calendar elements adapt to the selected theme.
- Maintain readable contrast in both modes.
- Avoid harsh colours in dark mode; use deep purple backgrounds with soft pink accents.
- Persist the user's selected theme between visits when the necessary storage is available.
- Include a smooth but subtle transition when changing themes.

## 7. AI Productivity Assistant

Add an optional AI assistant panel to help the business owner manage repetitive administrative work.

Include at least three productivity features:

**A. AI Task Planner**
- Generate a daily or weekly plan from the user's pending tasks and deadlines.
- Prioritise urgent and important tasks.
- Suggest a practical order for completing tasks.
- Allow the user to review and edit the generated plan before applying it.

**B. Client Message Generator**
- Generate polite, professional WhatsApp messages for appointment confirmations, reminders, rescheduling, cancellations, and follow-ups.
- Allow the user to select a tone: Friendly, Professional, or Warm.
- Provide an editable preview and a copy button.
- Never send a message automatically without user approval.

**C. Business Notes Summariser**
- Allow the user to enter consultation notes or general business notes.
- Summarise the information into key points, decisions, and follow-up tasks.
- Let the user review the results before adding suggested tasks to the task manager.

AI requirements:
- Clearly label AI-generated content.
- Allow users to edit and approve AI suggestions.
- Never invent appointment details, customer information, or payment records.
- If an AI API is not connected, provide a clear setup message or a working non-AI fallback rather than pretending that AI generation is functional.
- Keep personal customer information private and do not expose it unnecessarily.

## 8. Admin Dashboard Navigation

Create a sidebar or dashboard navigation with:
- Overview
- Appointments
- Services and Prices
- My Business Tasks
- AI Productivity Assistant
- Customer Enquiries
- Settings

The Overview dashboard should show:
- Today's appointments.
- Upcoming bookings.
- Pending tasks.
- Completed tasks.
- Monthly appointment count.
- Quick actions to add a task, create a booking, and update a service.

Keep the dashboard simple enough for a beginner to use without technical knowledge.

## 9. Data and Functionality

Build a genuinely interactive application, not just a static visual mock-up.

- Use React, TypeScript, and Tailwind CSS if appropriate for the Lovable environment.
- Use reusable components and clean project structure.
- Use Supabase for database storage and authentication if supported and configured.
- Store services, bookings, and tasks persistently.
- Implement create, read, update, and delete operations for tasks and appointments.
- Add sensible loading, empty, success, and error states.
- Validate form inputs and handle errors gracefully.
- Use secure authentication for owner-only dashboard features.
- Protect customer information and restrict access to authorised users.
- Do not expose secret API keys in frontend code.
- If a backend is not configured, use a clearly identified local prototype implementation and explain its limitations.

## 10. Final Quality Requirements

- Make every button and navigation item functional.
- Test adding, editing, deleting, filtering, and completing tasks.
- Test appointment creation and status updates.
- Test category filtering and task search.
- Test the dark mode toggle across all pages.
- Check responsiveness on mobile and desktop.
- Use realistic example data without inventing customer testimonials.
- Include a polished empty state when no tasks or appointments exist.
- Keep the website fast, intuitive, visually consistent, and easy to maintain.

The final result should feel like a real, premium hair-braiding brand combined with a practical business management tool.

**Build the homepage and core dashboard first, then implement and test the interactive functionality. Do not stop at generating the design; connect the interface to working application logic wherever the required services are available.**

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://braid-bliss-hq.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e025c8d7-a553-482b-aa89-b61bcb3a38a8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
