import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

// ---------- Types ----------
export interface User  { id: number; name: string; email: string; role: string; status: string; lastActive: string; avatar: string }
export interface Client { id: number; name: string; company: string; email: string; phone: string; projects: number; status: string; lastActivity: string; avatar: string }
export interface Project { id: number; name: string; client: string; manager: string; status: string; budget: number; spent: number; timeline: string; progress: number; color: string }
export interface EquipmentItem { id: number; name: string; category: string; status: string; assignedTo: string; location: string; returnDate: string }
export interface PlanningItem { id: number; title: string; project: string; status: string; assignee: string; lastUpdated: string }
export interface TeamMember { id: number; name: string; role: string; project: string; status: string; tasks: number; availability: number; contact: string }
export interface AssetFile { name: string; type: string; project: string; uploadedBy: string; date: string; size: string }
export interface ExpenseApproval { id: number; description: string; department: string; amount: number; requestedBy: string; date: string; status: string }
export interface Invoice { id: string; client: string; amount: number; date: string; dueDate: string; status: string; items: string }
export interface Payment { id: string; invoice: string; client: string; amount: number; date: string; method: string; status: string }
export interface Task { id: number; title: string; project: string; priority: string; status: string; dueDate: string; assignee: string }
export interface ScheduleEvent { id: number; date: number; title: string; project: string; location: string; crew: string | number; time: string; status: string }
export interface Message { id: number; sender: string; text: string; time: string; isMe: boolean }
export interface Conversation { id: number; name: string; role: string; avatar: string; lastMessage: string; time: string; unread: number; online: boolean; project?: string; messages: Message[] }

// ---------- Initial Data ----------
const initialUsers: User[] = [
  { id: 1, name: 'Sarah Jenkins', email: 'sarah@lumen.studio', role: 'Super Admin', status: 'Active', lastActive: '2 mins ago', avatar: 'SJ' },
  { id: 2, name: 'Marcus Chen', email: 'marcus@lumen.studio', role: 'Production Manager', status: 'Active', lastActive: '1 hour ago', avatar: 'MC' },
  { id: 3, name: 'Elena Rodriguez', email: 'elena@lumen.studio', role: 'Production Team', status: 'Active', lastActive: '3 hours ago', avatar: 'ER' },
  { id: 4, name: 'David Kim', email: 'david@lumen.studio', role: 'Production Team', status: 'Offline', lastActive: '1 day ago', avatar: 'DK' },
  { id: 5, name: 'Amanda Foster', email: 'amanda@lumen.studio', role: 'Accountant', status: 'Active', lastActive: '5 mins ago', avatar: 'AF' },
  { id: 6, name: 'James Wilson', email: 'j.wilson@nike.com', role: 'Client', status: 'Invited', lastActive: 'Never', avatar: 'JW' },
]

const initialClients: Client[] = [
  { id: 1, name: 'Sarah Jenkins', company: 'Nike', email: 'sarah@nike.com', phone: '+1 (555) 123-4567', projects: 5, status: 'Active', lastActivity: '2 hours ago', avatar: 'SJ' },
  { id: 2, name: 'Marcus Chen', company: 'TechCorp', email: 'marcus@techcorp.io', phone: '+1 (555) 234-5678', projects: 3, status: 'Active', lastActivity: '1 day ago', avatar: 'MC' },
  { id: 3, name: 'Elena Rodriguez', company: 'Local Coffee', email: 'elena@localcoffee.com', phone: '+1 (555) 345-6789', projects: 1, status: 'At Risk', lastActivity: '2 weeks ago', avatar: 'ER' },
  { id: 4, name: 'David Kim', company: 'Spotify', email: 'david@spotify.com', phone: '+1 (555) 456-7890', projects: 7, status: 'Active', lastActivity: '30 mins ago', avatar: 'DK' },
  { id: 5, name: 'Amanda Foster', company: 'Puma', email: 'amanda@puma.com', phone: '+1 (555) 567-8901', projects: 2, status: 'Active', lastActivity: '4 hours ago', avatar: 'AF' },
  { id: 6, name: 'James Wilson', company: 'Adidas', email: 'jwilson@adidas.com', phone: '+1 (555) 678-9012', projects: 0, status: 'Inactive', lastActivity: '3 months ago', avatar: 'JW' },
  { id: 7, name: 'Lisa Park', company: 'Apple', email: 'l.park@apple.com', phone: '+1 (555) 789-0123', projects: 4, status: 'Active', lastActivity: '1 hour ago', avatar: 'LP' },
  { id: 8, name: 'Tom Rivera', company: 'Netflix', email: 'tom@netflix.com', phone: '+1 (555) 890-1234', projects: 2, status: 'At Risk', lastActivity: '1 week ago', avatar: 'TR' },
]

const initialProjects: Project[] = [
  { id: 1, name: 'Summer Campaign', client: 'Nike', manager: 'Marcus Chen', status: 'In Production', budget: 45000, spent: 28000, timeline: 'Oct 15 - Nov 15', progress: 65, color: 'bg-blue-500' },
  { id: 2, name: 'Product Launch', client: 'TechCorp', manager: 'Elena Rodriguez', status: 'Planning', budget: 28000, spent: 5000, timeline: 'Nov 1 - Dec 1', progress: 20, color: 'bg-amber-500' },
  { id: 3, name: 'Brand Story', client: 'Local Coffee', manager: 'David Kim', status: 'Post-Production', budget: 8500, spent: 8000, timeline: 'Oct 1 - Oct 25', progress: 90, color: 'bg-emerald-500' },
  { id: 4, name: 'Artist Spotlight', client: 'Spotify', manager: 'Amanda Foster', status: 'Pre-Production', budget: 65000, spent: 15000, timeline: 'Nov 2 - Dec 15', progress: 25, color: 'bg-violet-500' },
  { id: 5, name: 'Training Series', client: 'Puma', manager: 'Marcus Chen', status: 'Completed', budget: 32000, spent: 31000, timeline: 'Aug 1 - Sep 15', progress: 100, color: 'bg-emerald-500' },
  { id: 6, name: 'Holiday Campaign', client: 'Adidas', manager: 'Elena Rodriguez', status: 'In Production', budget: 55000, spent: 22000, timeline: 'Oct 20 - Nov 30', progress: 40, color: 'bg-blue-500' },
  { id: 7, name: 'Keynote Event', client: 'Apple', manager: 'David Kim', status: 'Post-Production', budget: 78000, spent: 65000, timeline: 'Sep 10 - Oct 20', progress: 85, color: 'bg-emerald-500' },
  { id: 8, name: 'Series Launch', client: 'Netflix', manager: 'Amanda Foster', status: 'Planning', budget: 120000, spent: 10000, timeline: 'Dec 1 - Feb 28', progress: 10, color: 'bg-amber-500' },
]

const initialEquipment: EquipmentItem[] = [
  { id: 1, name: 'Sony FX6 Cinema Camera', category: 'Camera', status: 'In Use', assignedTo: 'Marcus Chen', location: 'Studio A', returnDate: 'Oct 20, 2026' },
  { id: 2, name: 'Canon C300 Mark III', category: 'Camera', status: 'Available', assignedTo: '-', location: 'Equipment Room', returnDate: '-' },
  { id: 3, name: 'ARRI Skypanel S60-C', category: 'Lighting', status: 'In Use', assignedTo: 'Elena Rodriguez', location: 'Stage 2', returnDate: 'Oct 18, 2026' },
  { id: 4, name: 'Sennheiser MKH 416', category: 'Audio', status: 'Available', assignedTo: '-', location: 'Equipment Room', returnDate: '-' },
  { id: 5, name: 'DJI Ronin 4D', category: 'Camera', status: 'Maintenance', assignedTo: '-', location: 'Repair Shop', returnDate: 'Oct 25, 2026' },
  { id: 6, name: 'Aputure 600d Pro', category: 'Lighting', status: 'Available', assignedTo: '-', location: 'Equipment Room', returnDate: '-' },
  { id: 7, name: 'Zoom F8 Recorder', category: 'Audio', status: 'In Use', assignedTo: 'David Kim', location: 'On Location', returnDate: 'Oct 16, 2026' },
  { id: 8, name: 'Matthews C-Stand Kit', category: 'Grip', status: 'Available', assignedTo: '-', location: 'Stage 1', returnDate: '-' },
  { id: 9, name: 'SmallHD Cine 13', category: 'Monitor', status: 'In Use', assignedTo: 'Amanda Foster', location: 'Edit Suite 2', returnDate: 'Oct 22, 2026' },
  { id: 10, name: 'Kino Flo Diva-Lite', category: 'Lighting', status: 'Maintenance', assignedTo: '-', location: 'Repair Shop', returnDate: 'Nov 1, 2026' },
  { id: 11, name: 'Blackmagic Pocket 6K', category: 'Camera', status: 'Available', assignedTo: '-', location: 'Equipment Room', returnDate: '-' },
  { id: 12, name: 'Rode Wireless Go II', category: 'Audio', status: 'In Use', assignedTo: 'James Wilson', location: 'On Location', returnDate: 'Oct 17, 2026' },
]

const initialScripts: PlanningItem[] = [
  { id: 1, title: 'Nike Summer Campaign Script', project: 'Summer Campaign', status: 'Approved', assignee: 'Marcus Chen', lastUpdated: '2 hours ago' },
  { id: 2, title: 'TechCorp Product Launch', project: 'Product Launch', status: 'Draft', assignee: 'Elena Rodriguez', lastUpdated: '1 day ago' },
  { id: 3, title: 'Local Coffee Brand Story v3', project: 'Brand Story', status: 'Approved', assignee: 'David Kim', lastUpdated: '3 days ago' },
  { id: 4, title: 'Artist Spotlight Interview Script', project: 'Artist Spotlight', status: 'In Review', assignee: 'Amanda Foster', lastUpdated: '5 hours ago' },
]

const initialStoryboards: PlanningItem[] = [
  { id: 1, title: 'Summer Campaign Storyboard', project: 'Summer Campaign', status: 'Approved', assignee: 'David Kim', lastUpdated: '1 day ago' },
  { id: 2, title: 'Product Launch Animatic', project: 'Product Launch', status: 'In Progress', assignee: 'Elena Rodriguez', lastUpdated: '4 hours ago' },
  { id: 3, title: 'Brand Story Moodboard', project: 'Brand Story', status: 'Approved', assignee: 'Marcus Chen', lastUpdated: '1 week ago' },
  { id: 4, title: 'Keynote Event Storyboard', project: 'Keynote Event', status: 'Pending', assignee: 'Lisa Park', lastUpdated: '2 days ago' },
]

const initialShotLists: PlanningItem[] = [
  { id: 1, title: 'Nike Location Shot List', project: 'Summer Campaign', status: 'Complete', assignee: 'Marcus Chen', lastUpdated: '3 days ago' },
  { id: 2, title: 'TechCorp Studio Setup', project: 'Product Launch', status: 'In Progress', assignee: 'James Wilson', lastUpdated: '1 hour ago' },
  { id: 3, title: 'Coffee Shop B-Roll List', project: 'Brand Story', status: 'Complete', assignee: 'Elena Rodriguez', lastUpdated: '5 days ago' },
  { id: 4, title: 'Netflix Series Shot Plan', project: 'Series Launch', status: 'Draft', assignee: 'Amanda Foster', lastUpdated: '1 day ago' },
]

const initialPermits: PlanningItem[] = [
  { id: 1, title: 'Downtown Filming Permit', project: 'Summer Campaign', status: 'Approved', assignee: 'David Kim', lastUpdated: '2 days ago' },
  { id: 2, title: 'Park Location Permit', project: 'Brand Story', status: 'Pending', assignee: 'Marcus Chen', lastUpdated: '1 week ago' },
  { id: 3, title: 'Aerial Drone Authorization', project: 'Artist Spotlight', status: 'Pending', assignee: 'Amanda Foster', lastUpdated: '4 days ago' },
  { id: 4, title: 'Studio Soundstage Permit', project: 'Holiday Campaign', status: 'Approved', assignee: 'Elena Rodriguez', lastUpdated: '1 day ago' },
]

const initialTeamMembers: TeamMember[] = [
  { id: 1, name: 'Elena R.', role: 'Director', project: 'Nike Summer Campaign', status: 'On Set', tasks: 3, availability: 20, contact: 'elena@prod.com' },
  { id: 2, name: 'David K.', role: 'DP', project: 'Available', status: 'Available', tasks: 0, availability: 100, contact: 'david@prod.com' },
  { id: 3, name: 'Sarah J.', role: 'Editor', project: 'Local Coffee', status: 'Editing', tasks: 5, availability: 40, contact: 'sarah@prod.com' },
  { id: 4, name: 'Mike T.', role: 'Sound', project: 'Nike Summer Campaign', status: 'On Set', tasks: 2, availability: 60, contact: 'mike@prod.com' },
  { id: 5, name: 'Marcus C.', role: 'Producer', project: 'TechCorp Launch', status: 'On Leave', tasks: 0, availability: 0, contact: 'marcus@prod.com' },
  { id: 6, name: 'Anna P.', role: 'Gaffer', project: 'Spotify Spotlight', status: 'Available', tasks: 1, availability: 85, contact: 'anna@prod.com' },
  { id: 7, name: 'Tom S.', role: 'PA', project: 'Nike Summer Campaign', status: 'On Set', tasks: 6, availability: 15, contact: 'tom@prod.com' },
  { id: 8, name: 'Lisa M.', role: 'Editor', project: 'Adidas Winter Promo', status: 'Available', tasks: 2, availability: 70, contact: 'lisa@prod.com' },
]

const initialExpenses: ExpenseApproval[] = [
  { id: 1, description: 'Camera Lens Rental - ARRI 50mm', department: 'Equipment', amount: 4500, requestedBy: 'Marcus Chen', date: 'Oct 12, 2026', status: 'Pending' },
  { id: 2, description: 'Location Fee - Downtown Studio', department: 'Production', amount: 8000, requestedBy: 'Elena Rodriguez', date: 'Oct 11, 2026', status: 'Pending' },
  { id: 3, description: 'Catering - 3 Day Shoot', department: 'Production', amount: 3200, requestedBy: 'David Kim', date: 'Oct 10, 2026', status: 'Approved' },
  { id: 4, description: 'Drone Operator - Aerial Footage', department: 'Talent', amount: 6500, requestedBy: 'Amanda Foster', date: 'Oct 9, 2026', status: 'Pending' },
  { id: 5, description: 'Color Grading Suite Rental', department: 'Post-Production', amount: 2800, requestedBy: 'James Wilson', date: 'Oct 8, 2026', status: 'Rejected' },
]

const initialInvoices: Invoice[] = [
  { id: 'INV-001', client: 'Nike', amount: 45000, date: 'Oct 1, 2026', dueDate: 'Oct 30, 2026', status: 'Pending', items: 'Summer Campaign - Production' },
  { id: 'INV-002', client: 'TechCorp', amount: 28000, date: 'Sep 25, 2026', dueDate: 'Oct 25, 2026', status: 'Overdue', items: 'Product Launch - Pre-Production' },
  { id: 'INV-003', client: 'Local Coffee', amount: 8500, date: 'Sep 15, 2026', dueDate: 'Oct 15, 2026', status: 'Paid', items: 'Brand Story - Post-Production' },
  { id: 'INV-004', client: 'Spotify', amount: 65000, date: 'Oct 5, 2026', dueDate: 'Nov 4, 2026', status: 'Pending', items: 'Artist Spotlight - Pre-Production' },
  { id: 'INV-005', client: 'Puma', amount: 32000, date: 'Aug 1, 2026', dueDate: 'Aug 31, 2026', status: 'Paid', items: 'Training Series - Completed' },
  { id: 'INV-006', client: 'Adidas', amount: 55000, date: 'Oct 10, 2026', dueDate: 'Nov 9, 2026', status: 'Pending', items: 'Holiday Campaign - Production' },
]

const initialPayments: Payment[] = [
  { id: 'PAY-001', invoice: 'INV-003', client: 'Local Coffee', amount: 8500, date: 'Oct 10, 2026', method: 'Wire Transfer', status: 'Completed' },
  { id: 'PAY-002', invoice: 'INV-005', client: 'Puma', amount: 32000, date: 'Aug 28, 2026', method: 'Credit Card', status: 'Completed' },
  { id: 'PAY-003', invoice: 'INV-001', client: 'Nike', amount: 15000, date: 'Oct 15, 2026', method: 'Check', status: 'Pending' },
  { id: 'PAY-004', invoice: 'INV-002', client: 'TechCorp', amount: 28000, date: 'Oct 20, 2026', method: 'Wire Transfer', status: 'Pending' },
]

const initialTasks: Task[] = [
  { id: 1, title: 'Rough cut review for Nike Summer Campaign', project: 'Nike Summer', priority: 'High', status: 'In Progress', dueDate: 'Oct 12', assignee: 'Sarah J.' },
  { id: 2, title: 'Color grading - Local Coffee Brand Story', project: 'Local Coffee', priority: 'Medium', status: 'To Do', dueDate: 'Oct 15', assignee: 'David K.' },
  { id: 3, title: 'Audio mix for TechCorp Launch', project: 'TechCorp Launch', priority: 'High', status: 'To Do', dueDate: 'Oct 10', assignee: 'Mike T.' },
  { id: 4, title: 'Export final deliverables for Puma', project: 'Puma Training', priority: 'Low', status: 'Completed', dueDate: 'Oct 8', assignee: 'Sarah J.' },
  { id: 5, title: 'Upload dailies from Spotify Spotlight shoot', project: 'Spotify Spotlight', priority: 'Medium', status: 'To Do', dueDate: 'Oct 14', assignee: 'Tom S.' },
  { id: 6, title: 'Prepare storyboard for Adidas pitch', project: 'Adidas Winter', priority: 'High', status: 'In Progress', dueDate: 'Oct 11', assignee: 'Elena R.' },
  { id: 7, title: 'Backup all project files to archive', project: 'General', priority: 'Low', status: 'To Do', dueDate: 'Oct 20', assignee: 'Marcus C.' },
  { id: 8, title: 'Review feedback on Summer Campaign edit', project: 'Nike Summer', priority: 'Medium', status: 'Completed', dueDate: 'Oct 9', assignee: 'Elena R.' },
]

const initialScheduleEvents: ScheduleEvent[] = [
  { id: 1, date: 8, title: 'Nike Summer - Studio Shoot', project: 'Nike Summer Campaign', location: 'Studio A', crew: 8, time: '8:00 AM - 6:00 PM', status: 'Confirmed' },
  { id: 2, date: 8, title: 'TechCorp Location Scout', project: 'TechCorp Launch', location: 'Riverside Park', crew: 3, time: '10:00 AM - 12:00 PM', status: 'Tentative' },
  { id: 3, date: 9, title: 'Spotify Spotlight - Interview', project: 'Spotify Spotlight', location: 'Warehouse', crew: 5, time: '9:00 AM - 3:00 PM', status: 'Confirmed' },
  { id: 4, date: 10, title: 'Local Coffee - Product Shoot', project: 'Local Coffee', location: 'Coffee Shop', crew: 4, time: '11:00 AM - 5:00 PM', status: 'Confirmed' },
  { id: 5, date: 12, title: 'Adidas Winter Promo Prep', project: 'Adidas Winter Promo', location: 'Studio B', crew: 2, time: '1:00 PM - 4:00 PM', status: 'Tentative' },
  { id: 6, date: 15, title: 'Nike Summer - Final Day', project: 'Nike Summer Campaign', location: 'Studio A', crew: 10, time: '7:00 AM - 8:00 PM', status: 'Confirmed' },
]

const initialAssets: Record<string, AssetFile[]> = {
  footage: [
    { name: 'Nike_Shoot_Day1.mov', type: 'Video', project: 'Nike Summer', uploadedBy: 'Elena R.', date: 'Jun 5', size: '24.5 GB' },
    { name: 'Nike_Shoot_Day2.mov', type: 'Video', project: 'Nike Summer', uploadedBy: 'David K.', date: 'Jun 6', size: '31.2 GB' },
    { name: 'TechCorp_Broll.mp4', type: 'Video', project: 'TechCorp Launch', uploadedBy: 'Sarah J.', date: 'Jun 3', size: '8.7 GB' },
    { name: 'Spotify_Interview_ProRes.mov', type: 'Video', project: 'Spotify Spotlight', uploadedBy: 'Mike T.', date: 'Jun 1', size: '45.0 GB' },
    { name: 'LocalCoffee_A_Roll.mp4', type: 'Video', project: 'Local Coffee', uploadedBy: 'Elena R.', date: 'May 28', size: '12.3 GB' },
  ],
  photos: [
    { name: 'Nike_Location_Scout_01.jpg', type: 'Image', project: 'Nike Summer', uploadedBy: 'Anna P.', date: 'Jun 4', size: '8.2 MB' },
    { name: 'TechCorp_Product_Shots.zip', type: 'Archive', project: 'TechCorp Launch', uploadedBy: 'Marcus C.', date: 'Jun 2', size: '156 MB' },
    { name: 'Spotify_BTS_Photos.zip', type: 'Archive', project: 'Spotify Spotlight', uploadedBy: 'Tom S.', date: 'May 30', size: '342 MB' },
  ],
  audio: [
    { name: 'Nike_VO_Take1.wav', type: 'Audio', project: 'Nike Summer', uploadedBy: 'Mike T.', date: 'Jun 7', size: '245 MB' },
    { name: 'Spotify_Narration_Final.wav', type: 'Audio', project: 'Spotify Spotlight', uploadedBy: 'Sarah J.', date: 'Jun 4', size: '512 MB' },
    { name: 'LocalCoffee_Ambient.wav', type: 'Audio', project: 'Local Coffee', uploadedBy: 'Mike T.', date: 'May 25', size: '89 MB' },
  ],
  graphics: [
    { name: 'Nike_Logo_Animation.mov', type: 'Motion', project: 'Nike Summer', uploadedBy: 'Lisa M.', date: 'Jun 6', size: '1.2 GB' },
    { name: 'TechCorp_Slides.pptx', type: 'Presentation', project: 'TechCorp Launch', uploadedBy: 'Marcus C.', date: 'Jun 1', size: '45 MB' },
    { name: 'Spotify_Thumbnails.psd', type: 'PSD', project: 'Spotify Spotlight', uploadedBy: 'Sarah J.', date: 'May 29', size: '212 MB' },
  ],
  documents: [
    { name: 'Nike_Call_Sheet_Day1.pdf', type: 'PDF', project: 'Nike Summer', uploadedBy: 'Elena R.', date: 'Jun 5', size: '2.4 MB' },
    { name: 'TechCorp_Script_V3.docx', type: 'Document', project: 'TechCorp Launch', uploadedBy: 'Marcus C.', date: 'Jun 2', size: '1.8 MB' },
    { name: 'Spotify_Run_of_Show.pdf', type: 'PDF', project: 'Spotify Spotlight', uploadedBy: 'Elena R.', date: 'May 28', size: '3.1 MB' },
  ],
  edits: [
    { name: 'Nike_Summer_Rough_Cut.mov', type: 'Video', project: 'Nike Summer', uploadedBy: 'Sarah J.', date: 'Jun 7', size: '156 GB' },
    { name: 'Spotify_Doc_Assembly.mov', type: 'Video', project: 'Spotify Spotlight', uploadedBy: 'Sarah J.', date: 'Jun 5', size: '89 GB' },
    { name: 'LocalCoffee_Final_Cut.mov', type: 'Video', project: 'Local Coffee', uploadedBy: 'David K.', date: 'Jun 2', size: '45 GB' },
  ],
}

const initialConversations: Conversation[] = [
  { id: 1, name: 'Marcus Chen', role: 'Production Manager', project: 'Summer Campaign', avatar: 'MC', lastMessage: 'The rough cut looks great! Just a few notes...', time: '2m ago', unread: 2, online: true, messages: [
    { id: 1, sender: 'Marcus Chen', text: 'Hey! Just finished the rough cut for the Nike campaign.', time: '10:30 AM', isMe: false },
    { id: 2, sender: 'You', text: 'Awesome, send it over!', time: '10:32 AM', isMe: true },
    { id: 3, sender: 'Marcus Chen', text: 'The rough cut looks great! Just a few notes on the color grading.', time: '10:35 AM', isMe: false },
  ]},
  { id: 2, name: 'Elena Rodriguez', role: 'Director', project: 'Summer Campaign', avatar: 'ER', lastMessage: 'Location scouting is done for Nike tomorrow.', time: '1h ago', unread: 0, online: true, messages: [
    { id: 1, sender: 'Elena Rodriguez', text: 'Location scouting is done for Nike tomorrow.', time: '12:00 PM', isMe: false },
  ]},
  { id: 3, name: 'Sarah Jenkins', role: 'Super Admin', project: 'All Projects', avatar: 'SJ', lastMessage: 'New budget approval needed for equipment rental.', time: '3h ago', unread: 1, online: false, messages: [
    { id: 1, sender: 'Sarah Jenkins', text: 'New budget approval needed for equipment rental.', time: '9:00 AM', isMe: false },
  ]},
  { id: 4, name: 'David Kim', role: 'DP', project: 'Artist Spotlight', avatar: 'DK', lastMessage: 'Ready for the Spotify spotlight shoot.', time: '5h ago', unread: 0, online: false, messages: [
    { id: 1, sender: 'David Kim', text: 'Ready for the Spotify spotlight shoot tomorrow.', time: '8:00 AM', isMe: false },
  ]},
  { id: 5, name: 'Amanda Foster', role: 'Accountant', project: 'All Projects', avatar: 'AF', lastMessage: 'Updated the project budget breakdown.', time: '1d ago', unread: 0, online: false, messages: [
    { id: 1, sender: 'Amanda Foster', text: 'Updated the project budget breakdown.', time: '2:00 PM', isMe: false },
  ]},
  { id: 6, name: 'Mike T.', role: 'Sound Engineer', project: 'Summer Campaign', avatar: 'MT', lastMessage: 'Audio equipment checked and ready.', time: '2h ago', unread: 0, online: true, messages: [
    { id: 1, sender: 'Mike T.', text: 'Audio equipment checked and ready for tomorrow.', time: '11:00 AM', isMe: false },
  ]},
  { id: 7, name: 'Tom S.', role: 'PA', project: 'Summer Campaign', avatar: 'TS', lastMessage: 'Permits are all sorted for the location.', time: '4h ago', unread: 0, online: true, messages: [
    { id: 1, sender: 'Tom S.', text: 'Permits are all sorted for the downtown location.', time: '9:30 AM', isMe: false },
  ]},
  { id: 8, name: 'Anna P.', role: 'Gaffer', project: 'Product Launch', avatar: 'AP', lastMessage: 'Lighting setup will be done by 7am.', time: '6h ago', unread: 0, online: false, messages: [
    { id: 1, sender: 'Anna P.', text: 'Lighting setup will be done by 7am on shoot day.', time: '7:00 AM', isMe: false },
  ]},
  { id: 9, name: 'Sarah Jenkins', role: 'Client (Nike)', project: 'Summer Campaign', avatar: 'SJ', lastMessage: 'Looking forward to the campaign preview.', time: '1d ago', unread: 1, online: false, messages: [
    { id: 1, sender: 'Sarah Jenkins', text: 'Looking forward to the campaign preview next week.', time: '3:00 PM', isMe: false },
  ]},
  { id: 10, name: 'Marcus Chen', role: 'Client (TechCorp)', project: 'Product Launch', avatar: 'MC', lastMessage: 'Can we review the storyboard?', time: '2d ago', unread: 0, online: false, messages: [
    { id: 1, sender: 'Marcus Chen', text: 'Can we review the storyboard this week?', time: '1:00 PM', isMe: false },
  ]},
]

// ---------- Context ----------
interface AppStoreContextType {
  users: User[]; addUser: (u: User) => void; updateUser: (id: number, u: Partial<User>) => void; deleteUser: (id: number) => void
  clients: Client[]; addClient: (c: Client) => void; updateClient: (id: number, c: Partial<Client>) => void; deleteClient: (id: number) => void
  projects: Project[]; addProject: (p: Project) => void; updateProject: (id: number, p: Partial<Project>) => void; deleteProject: (id: number) => void
  equipment: EquipmentItem[]; addEquipment: (e: EquipmentItem) => void; updateEquipment: (id: number, e: Partial<EquipmentItem>) => void; deleteEquipment: (id: number) => void
  scripts: PlanningItem[]; addScript: (s: PlanningItem) => void; updateScript: (id: number, s: Partial<PlanningItem>) => void; deleteScript: (id: number) => void
  storyboards: PlanningItem[]; addStoryboard: (s: PlanningItem) => void; updateStoryboard: (id: number, s: Partial<PlanningItem>) => void; deleteStoryboard: (id: number) => void
  shotLists: PlanningItem[]; addShotList: (s: PlanningItem) => void; updateShotList: (id: number, s: Partial<PlanningItem>) => void; deleteShotList: (id: number) => void
  permits: PlanningItem[]; addPermit: (s: PlanningItem) => void; updatePermit: (id: number, s: Partial<PlanningItem>) => void; deletePermit: (id: number) => void
  teamMembers: TeamMember[]; addTeamMember: (t: TeamMember) => void; updateTeamMember: (id: number, t: Partial<TeamMember>) => void; deleteTeamMember: (id: number) => void
  expenses: ExpenseApproval[]; addExpense: (e: ExpenseApproval) => void; updateExpense: (id: number, e: Partial<ExpenseApproval>) => void
  invoices: Invoice[]; addInvoice: (i: Invoice) => void; updateInvoice: (id: string, i: Partial<Invoice>) => void; deleteInvoice: (id: string) => void
  payments: Payment[]; addPayment: (p: Payment) => void; updatePayment: (id: string, p: Partial<Payment>) => void
  tasks: Task[]; addTask: (t: Task) => void; updateTask: (id: number, t: Partial<Task>) => void; deleteTask: (id: number) => void
  scheduleEvents: ScheduleEvent[]; addScheduleEvent: (e: ScheduleEvent) => void; updateScheduleEvent: (id: number, e: Partial<ScheduleEvent>) => void; deleteScheduleEvent: (id: number) => void
  assets: Record<string, AssetFile[]>; addAsset: (folder: string, a: AssetFile) => void; deleteAsset: (folder: string, name: string) => void
  conversations: Conversation[]; sendMessage: (conversationId: number, text: string) => void
}

const AppStoreContext = createContext<AppStoreContextType | null>(null)

let nextId = 100

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [clients, setClients] = useState<Client[]>(initialClients)
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [equipment, setEquipment] = useState<EquipmentItem[]>(initialEquipment)
  const [scripts, setScripts] = useState<PlanningItem[]>(initialScripts)
  const [storyboards, setStoryboards] = useState<PlanningItem[]>(initialStoryboards)
  const [shotLists, setShotLists] = useState<PlanningItem[]>(initialShotLists)
  const [permits, setPermits] = useState<PlanningItem[]>(initialPermits)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers)
  const [expenses, setExpenses] = useState<ExpenseApproval[]>(initialExpenses)
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices)
  const [payments, setPayments] = useState<Payment[]>(initialPayments)
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>(initialScheduleEvents)
  const [assets, setAssets] = useState<Record<string, AssetFile[]>>(initialAssets)
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)

  const addUser = useCallback((u: User) => setUsers(p => [...p, { ...u, id: ++nextId }]), [])
  const updateUser = useCallback((id: number, u: Partial<User>) => setUsers(p => p.map(x => x.id === id ? { ...x, ...u } : x)), [])
  const deleteUser = useCallback((id: number) => setUsers(p => p.filter(x => x.id !== id)), [])

  const addClient = useCallback((c: Client) => setClients(p => [...p, { ...c, id: ++nextId }]), [])
  const updateClient = useCallback((id: number, c: Partial<Client>) => setClients(p => p.map(x => x.id === id ? { ...x, ...c } : x)), [])
  const deleteClient = useCallback((id: number) => setClients(p => p.filter(x => x.id !== id)), [])

  const addProject = useCallback((p: Project) => setProjects(prev => [...prev, { ...p, id: ++nextId }]), [])
  const updateProject = useCallback((id: number, p: Partial<Project>) => setProjects(prev => prev.map(x => x.id === id ? { ...x, ...p } : x)), [])
  const deleteProject = useCallback((id: number) => setProjects(prev => prev.filter(x => x.id !== id)), [])

  const addEquipment = useCallback((e: EquipmentItem) => setEquipment(prev => [...prev, { ...e, id: ++nextId }]), [])
  const updateEquipment = useCallback((id: number, e: Partial<EquipmentItem>) => setEquipment(prev => prev.map(x => x.id === id ? { ...x, ...e } : x)), [])
  const deleteEquipment = useCallback((id: number) => setEquipment(prev => prev.filter(x => x.id !== id)), [])

  const addScript = useCallback((s: PlanningItem) => setScripts(prev => [...prev, { ...s, id: ++nextId }]), [])
  const updateScript = useCallback((id: number, s: Partial<PlanningItem>) => setScripts(prev => prev.map(x => x.id === id ? { ...x, ...s } : x)), [])
  const deleteScript = useCallback((id: number) => setScripts(prev => prev.filter(x => x.id !== id)), [])

  const addStoryboard = useCallback((s: PlanningItem) => setStoryboards(prev => [...prev, { ...s, id: ++nextId }]), [])
  const updateStoryboard = useCallback((id: number, s: Partial<PlanningItem>) => setStoryboards(prev => prev.map(x => x.id === id ? { ...x, ...s } : x)), [])
  const deleteStoryboard = useCallback((id: number) => setStoryboards(prev => prev.filter(x => x.id !== id)), [])

  const addShotList = useCallback((s: PlanningItem) => setShotLists(prev => [...prev, { ...s, id: ++nextId }]), [])
  const updateShotList = useCallback((id: number, s: Partial<PlanningItem>) => setShotLists(prev => prev.map(x => x.id === id ? { ...x, ...s } : x)), [])
  const deleteShotList = useCallback((id: number) => setShotLists(prev => prev.filter(x => x.id !== id)), [])

  const addPermit = useCallback((s: PlanningItem) => setPermits(prev => [...prev, { ...s, id: ++nextId }]), [])
  const updatePermit = useCallback((id: number, s: Partial<PlanningItem>) => setPermits(prev => prev.map(x => x.id === id ? { ...x, ...s } : x)), [])
  const deletePermit = useCallback((id: number) => setPermits(prev => prev.filter(x => x.id !== id)), [])

  const addTeamMember = useCallback((t: TeamMember) => setTeamMembers(prev => [...prev, { ...t, id: ++nextId }]), [])
  const updateTeamMember = useCallback((id: number, t: Partial<TeamMember>) => setTeamMembers(prev => prev.map(x => x.id === id ? { ...x, ...t } : x)), [])
  const deleteTeamMember = useCallback((id: number) => setTeamMembers(prev => prev.filter(x => x.id !== id)), [])

  const addExpense = useCallback((e: ExpenseApproval) => setExpenses(prev => [...prev, { ...e, id: ++nextId }]), [])
  const updateExpense = useCallback((id: number, e: Partial<ExpenseApproval>) => setExpenses(prev => prev.map(x => x.id === id ? { ...x, ...e } : x)), [])

  const addInvoice = useCallback((i: Invoice) => setInvoices(prev => [...prev, i]), [])
  const updateInvoice = useCallback((id: string, i: Partial<Invoice>) => setInvoices(prev => prev.map(x => x.id === id ? { ...x, ...i } : x)), [])
  const deleteInvoice = useCallback((id: string) => setInvoices(prev => prev.filter(x => x.id !== id)), [])

  const addPayment = useCallback((p: Payment) => setPayments(prev => [...prev, p]), [])
  const updatePayment = useCallback((id: string, p: Partial<Payment>) => setPayments(prev => prev.map(x => x.id === id ? { ...x, ...p } : x)), [])

  const addTask = useCallback((t: Task) => setTasks(prev => [...prev, { ...t, id: ++nextId }]), [])
  const updateTask = useCallback((id: number, t: Partial<Task>) => setTasks(prev => prev.map(x => x.id === id ? { ...x, ...t } : x)), [])
  const deleteTask = useCallback((id: number) => setTasks(prev => prev.filter(x => x.id !== id)), [])

  const addScheduleEvent = useCallback((e: ScheduleEvent) => setScheduleEvents(prev => [...prev, { ...e, id: ++nextId }]), [])
  const updateScheduleEvent = useCallback((id: number, e: Partial<ScheduleEvent>) => setScheduleEvents(prev => prev.map(x => x.id === id ? { ...x, ...e } : x)), [])
  const deleteScheduleEvent = useCallback((id: number) => setScheduleEvents(prev => prev.filter(x => x.id !== id)), [])

  const addAsset = useCallback((folder: string, a: AssetFile) => setAssets(prev => ({ ...prev, [folder]: [...(prev[folder] || []), a] })), [])
  const deleteAsset = useCallback((folder: string, name: string) => setAssets(prev => ({ ...prev, [folder]: (prev[folder] || []).filter(x => x.name !== name) })), [])

  const sendMessage = useCallback((conversationId: number, text: string) => {
    setConversations(prev => prev.map(c => {
      if (c.id !== conversationId) return c
      const newMsg: Message = { id: c.messages.length + 1, sender: 'You', text, time: 'Just now', isMe: true }
      return { ...c, messages: [...c.messages, newMsg], lastMessage: text, time: 'Just now' }
    }))
  }, [])

  const value: AppStoreContextType = {
    users, addUser, updateUser, deleteUser,
    clients, addClient, updateClient, deleteClient,
    projects, addProject, updateProject, deleteProject,
    equipment, addEquipment, updateEquipment, deleteEquipment,
    scripts, addScript, updateScript, deleteScript,
    storyboards, addStoryboard, updateStoryboard, deleteStoryboard,
    shotLists, addShotList, updateShotList, deleteShotList,
    permits, addPermit, updatePermit, deletePermit,
    teamMembers, addTeamMember, updateTeamMember, deleteTeamMember,
    expenses, addExpense, updateExpense,
    invoices, addInvoice, updateInvoice, deleteInvoice,
    payments, addPayment, updatePayment,
    tasks, addTask, updateTask, deleteTask,
    scheduleEvents, addScheduleEvent, updateScheduleEvent, deleteScheduleEvent,
    assets, addAsset, deleteAsset,
    conversations, sendMessage,
  }

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(AppStoreContext)
  if (!ctx) throw new Error('useStore must be used within an AppStoreProvider')
  return ctx
}
