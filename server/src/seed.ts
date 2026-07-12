import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  const hash = await bcrypt.hash('password123', 10)

  // Users
  const admin = await prisma.user.create({ data: { name: 'Alex Rivera', email: 'admin@lumen.studio', password: hash, role: 'admin', status: 'Active', lastActive: 'Just now', avatar: 'AR' } })
  const manager = await prisma.user.create({ data: { name: 'Jordan Chen', email: 'manager@lumen.studio', password: hash, role: 'manager', status: 'Active', lastActive: '1 hour ago', avatar: 'JC' } })
  const crew1 = await prisma.user.create({ data: { name: 'Sam Wilson', email: 'crew@lumen.studio', password: hash, role: 'crew', status: 'Active', lastActive: '3 hours ago', avatar: 'SW' } })
  const accountant = await prisma.user.create({ data: { name: 'Taylor Reed', email: 'accountant@lumen.studio', password: hash, role: 'accountant', status: 'Active', lastActive: '5 mins ago', avatar: 'TR' } })
  const clientUser = await prisma.user.create({ data: { name: 'Morgan Chase', email: 'client@lumen.studio', password: hash, role: 'client', status: 'Active', lastActive: '2 mins ago', avatar: 'MC' } })
  await prisma.user.create({ data: { name: 'Elena Rodriguez', email: 'elena@lumen.studio', password: hash, role: 'crew', status: 'Active', lastActive: '3 hours ago', avatar: 'ER' } })
  await prisma.user.create({ data: { name: 'David Kim', email: 'david@lumen.studio', password: hash, role: 'crew', status: 'Offline', lastActive: '1 day ago', avatar: 'DK' } })
  await prisma.user.create({ data: { name: 'Amanda Foster', email: 'amanda@lumen.studio', password: hash, role: 'accountant', status: 'Active', lastActive: '5 mins ago', avatar: 'AF' } })
  await prisma.user.create({ data: { name: 'James Wilson', email: 'j.wilson@nike.com', password: hash, role: 'client', status: 'Invited', lastActive: 'Never', avatar: 'JW' } })

  // Clients
  const nike = await prisma.client.create({ data: { name: 'Sarah Jenkins', company: 'Nike', email: 'sarah@nike.com', phone: '+1 (555) 123-4567', projects: 1, status: 'Active', lastActivity: '2 hours ago', avatar: 'SJ' } })
  const techcorp = await prisma.client.create({ data: { name: 'Marcus Chen', company: 'TechCorp', email: 'marcus@techcorp.io', phone: '+1 (555) 234-5678', projects: 1, status: 'Active', lastActivity: '1 day ago', avatar: 'MC' } })
  const localCoffee = await prisma.client.create({ data: { name: 'Elena Rodriguez', company: 'Local Coffee', email: 'elena@localcoffee.com', phone: '+1 (555) 345-6789', projects: 1, status: 'At Risk', lastActivity: '2 weeks ago', avatar: 'ER' } })
  const spotify = await prisma.client.create({ data: { name: 'David Kim', company: 'Spotify', email: 'david@spotify.com', phone: '+1 (555) 456-7890', projects: 1, status: 'Active', lastActivity: '30 mins ago', avatar: 'DK' } })
  const puma = await prisma.client.create({ data: { name: 'Amanda Foster', company: 'Puma', email: 'amanda@puma.com', phone: '+1 (555) 567-8901', projects: 1, status: 'Active', lastActivity: '4 hours ago', avatar: 'AF' } })
  const adidas = await prisma.client.create({ data: { name: 'James Wilson', company: 'Adidas', email: 'jwilson@adidas.com', phone: '+1 (555) 678-9012', projects: 0, status: 'Inactive', lastActivity: '3 months ago', avatar: 'JW' } })
  await prisma.client.create({ data: { name: 'Lisa Park', company: 'Apple', email: 'l.park@apple.com', phone: '+1 (555) 789-0123', projects: 0, status: 'Active', lastActivity: '1 hour ago', avatar: 'LP' } })
  await prisma.client.create({ data: { name: 'Tom Rivera', company: 'Netflix', email: 'tom@netflix.com', phone: '+1 (555) 890-1234', projects: 0, status: 'At Risk', lastActivity: '1 week ago', avatar: 'TR' } })

  // Projects
  const proj1 = await prisma.project.create({ data: { name: 'Summer Campaign', clientId: nike.id, managerId: manager.id, clientName: nike.name, managerName: manager.name, status: 'In Production', budget: 45000, spent: 28000, timeline: 'Oct 15 - Nov 15', progress: 65, color: 'bg-blue-500' } })
  const proj2 = await prisma.project.create({ data: { name: 'Product Launch', clientId: techcorp.id, managerId: manager.id, clientName: techcorp.name, managerName: 'Elena Rodriguez', status: 'Planning', budget: 28000, spent: 5000, timeline: 'Nov 1 - Dec 1', progress: 20, color: 'bg-amber-500' } })
  const proj3 = await prisma.project.create({ data: { name: 'Brand Story', clientId: localCoffee.id, managerId: manager.id, clientName: localCoffee.name, managerName: 'David Kim', status: 'Post-Production', budget: 8500, spent: 8000, timeline: 'Oct 1 - Oct 25', progress: 90, color: 'bg-emerald-500' } })
  const proj4 = await prisma.project.create({ data: { name: 'Artist Spotlight', clientId: spotify.id, managerId: manager.id, clientName: spotify.name, managerName: 'Amanda Foster', status: 'Pre-Production', budget: 65000, spent: 15000, timeline: 'Nov 2 - Dec 15', progress: 25, color: 'bg-violet-500' } })
  const proj5 = await prisma.project.create({ data: { name: 'Training Series', clientId: puma.id, managerId: manager.id, clientName: puma.name, managerName: manager.name, status: 'Completed', budget: 32000, spent: 31000, timeline: 'Aug 1 - Sep 15', progress: 100, color: 'bg-emerald-500' } })
  const proj6 = await prisma.project.create({ data: { name: 'Holiday Campaign', clientId: adidas.id, managerId: manager.id, clientName: adidas.name, managerName: 'Elena Rodriguez', status: 'In Production', budget: 55000, spent: 22000, timeline: 'Oct 20 - Nov 30', progress: 40, color: 'bg-blue-500' } })

  // Equipment
  const equipmentData = [
    { name: 'Sony FX6 Cinema Camera', category: 'Camera', status: 'In Use', assignedTo: 'Jordan Chen', location: 'Studio A', returnDate: 'Oct 20, 2026' },
    { name: 'Canon C300 Mark III', category: 'Camera', status: 'Available', assignedTo: '-', location: 'Equipment Room', returnDate: '-' },
    { name: 'ARRI Skypanel S60-C', category: 'Lighting', status: 'In Use', assignedTo: 'Elena Rodriguez', location: 'Stage 2', returnDate: 'Oct 18, 2026' },
    { name: 'Sennheiser MKH 416', category: 'Audio', status: 'Available', assignedTo: '-', location: 'Equipment Room', returnDate: '-' },
    { name: 'DJI Ronin 4D', category: 'Camera', status: 'Maintenance', assignedTo: '-', location: 'Repair Shop', returnDate: 'Oct 25, 2026' },
    { name: 'Aputure 600d Pro', category: 'Lighting', status: 'Available', assignedTo: '-', location: 'Equipment Room', returnDate: '-' },
    { name: 'Zoom F8 Recorder', category: 'Audio', status: 'In Use', assignedTo: 'David Kim', location: 'On Location', returnDate: 'Oct 16, 2026' },
    { name: 'Matthews C-Stand Kit', category: 'Grip', status: 'Available', assignedTo: '-', location: 'Stage 1', returnDate: '-' },
    { name: 'SmallHD Cine 13', category: 'Monitor', status: 'In Use', assignedTo: 'Amanda Foster', location: 'Edit Suite 2', returnDate: 'Oct 22, 2026' },
    { name: 'Kino Flo Diva-Lite', category: 'Lighting', status: 'Maintenance', assignedTo: '-', location: 'Repair Shop', returnDate: 'Nov 1, 2026' },
  ]
  for (const e of equipmentData) await prisma.equipment.create({ data: e })

  // Tasks
  await prisma.task.create({ data: { title: 'Rough cut review for Nike Summer Campaign', projectId: proj1.id, priority: 'High', status: 'In Progress', dueDate: 'Oct 12', assignee: 'Sam Wilson', userId: crew1.id } })
  await prisma.task.create({ data: { title: 'Color grading - Local Coffee Brand Story', projectId: proj3.id, priority: 'Medium', status: 'To Do', dueDate: 'Oct 15', assignee: 'David K.', userId: crew1.id } })
  await prisma.task.create({ data: { title: 'Audio mix for TechCorp Launch', projectId: proj2.id, priority: 'High', status: 'To Do', dueDate: 'Oct 10', assignee: 'Mike T.', userId: crew1.id } })
  await prisma.task.create({ data: { title: 'Export final deliverables for Puma', projectId: proj5.id, priority: 'Low', status: 'Completed', dueDate: 'Oct 8', assignee: 'Sam Wilson', userId: crew1.id } })
  await prisma.task.create({ data: { title: 'Upload dailies from Spotify Spotlight shoot', projectId: proj4.id, priority: 'Medium', status: 'To Do', dueDate: 'Oct 14', assignee: 'Tom S.', userId: crew1.id } })
  await prisma.task.create({ data: { title: 'Prepare storyboard for Adidas pitch', projectId: proj6.id, priority: 'High', status: 'In Progress', dueDate: 'Oct 11', assignee: 'Elena R.', userId: crew1.id } })
  await prisma.task.create({ data: { title: 'Backup all project files to archive', projectId: proj1.id, priority: 'Low', status: 'To Do', dueDate: 'Oct 20', assignee: 'Jordan Chen', userId: manager.id } })
  await prisma.task.create({ data: { title: 'Review feedback on Summer Campaign edit', projectId: proj1.id, priority: 'Medium', status: 'Completed', dueDate: 'Oct 9', assignee: 'Elena R.', userId: crew1.id } })

  // Planning - Scripts
  await prisma.script.create({ data: { title: 'Nike Summer Campaign Script', projectId: proj1.id, status: 'Approved', assignee: 'Jordan Chen', lastUpdated: '2 hours ago' } })
  await prisma.script.create({ data: { title: 'TechCorp Product Launch', projectId: proj2.id, status: 'Draft', assignee: 'Elena Rodriguez', lastUpdated: '1 day ago' } })
  await prisma.script.create({ data: { title: 'Local Coffee Brand Story v3', projectId: proj3.id, status: 'Approved', assignee: 'David Kim', lastUpdated: '3 days ago' } })
  await prisma.script.create({ data: { title: 'Artist Spotlight Interview Script', projectId: proj4.id, status: 'In Review', assignee: 'Amanda Foster', lastUpdated: '5 hours ago' } })

  // Planning - Storyboards
  await prisma.storyboard.create({ data: { title: 'Summer Campaign Storyboard', projectId: proj1.id, status: 'Approved', assignee: 'David Kim', lastUpdated: '1 day ago' } })
  await prisma.storyboard.create({ data: { title: 'Product Launch Animatic', projectId: proj2.id, status: 'In Progress', assignee: 'Elena Rodriguez', lastUpdated: '4 hours ago' } })
  await prisma.storyboard.create({ data: { title: 'Brand Story Moodboard', projectId: proj3.id, status: 'Approved', assignee: 'Jordan Chen', lastUpdated: '1 week ago' } })

  // Planning - Shot Lists
  await prisma.shotList.create({ data: { title: 'Nike Location Shot List', projectId: proj1.id, status: 'Complete', assignee: 'Jordan Chen', lastUpdated: '3 days ago' } })
  await prisma.shotList.create({ data: { title: 'TechCorp Studio Setup', projectId: proj2.id, status: 'In Progress', assignee: 'Sam Wilson', lastUpdated: '1 hour ago' } })
  await prisma.shotList.create({ data: { title: 'Coffee Shop B-Roll List', projectId: proj3.id, status: 'Complete', assignee: 'Elena Rodriguez', lastUpdated: '5 days ago' } })

  // Planning - Permits
  await prisma.permit.create({ data: { title: 'Downtown Filming Permit', projectId: proj1.id, status: 'Approved', assignee: 'David Kim', lastUpdated: '2 days ago' } })
  await prisma.permit.create({ data: { title: 'Park Location Permit', projectId: proj3.id, status: 'Pending', assignee: 'Jordan Chen', lastUpdated: '1 week ago' } })
  await prisma.permit.create({ data: { title: 'Aerial Drone Authorization', projectId: proj4.id, status: 'Pending', assignee: 'Amanda Foster', lastUpdated: '4 days ago' } })
  await prisma.permit.create({ data: { title: 'Studio Soundstage Permit', projectId: proj6.id, status: 'Approved', assignee: 'Elena Rodriguez', lastUpdated: '1 day ago' } })

  // Team Members
  await prisma.teamMember.create({ data: { name: 'Elena R.', role: 'Director', projectId: proj1.id, status: 'On Set', tasks: 3, availability: 20, contact: 'elena@prod.com' } })
  await prisma.teamMember.create({ data: { name: 'David K.', role: 'DP', projectId: proj1.id, status: 'Available', tasks: 0, availability: 100, contact: 'david@prod.com' } })
  await prisma.teamMember.create({ data: { name: 'Sam Wilson', role: 'Editor', projectId: proj3.id, status: 'Editing', tasks: 5, availability: 40, contact: 'sam@prod.com' } })
  await prisma.teamMember.create({ data: { name: 'Mike T.', role: 'Sound', projectId: proj1.id, status: 'On Set', tasks: 2, availability: 60, contact: 'mike@prod.com' } })
  await prisma.teamMember.create({ data: { name: 'Jordan C.', role: 'Producer', projectId: proj2.id, status: 'On Leave', tasks: 0, availability: 0, contact: 'jordan@prod.com' } })
  await prisma.teamMember.create({ data: { name: 'Anna P.', role: 'Gaffer', projectId: proj4.id, status: 'Available', tasks: 1, availability: 85, contact: 'anna@prod.com' } })
  await prisma.teamMember.create({ data: { name: 'Tom S.', role: 'PA', projectId: proj1.id, status: 'On Set', tasks: 6, availability: 15, contact: 'tom@prod.com' } })
  await prisma.teamMember.create({ data: { name: 'Lisa M.', role: 'Editor', projectId: proj6.id, status: 'Available', tasks: 2, availability: 70, contact: 'lisa@prod.com' } })

  // Schedule
  await prisma.scheduleEvent.create({ data: { date: 8, title: 'Nike Summer - Studio Shoot', projectId: proj1.id, location: 'Studio A', crew: '8', time: '8:00 AM - 6:00 PM', status: 'Confirmed' } })
  await prisma.scheduleEvent.create({ data: { date: 8, title: 'TechCorp Location Scout', projectId: proj2.id, location: 'Riverside Park', crew: '3', time: '10:00 AM - 12:00 PM', status: 'Tentative' } })
  await prisma.scheduleEvent.create({ data: { date: 9, title: 'Spotify Spotlight - Interview', projectId: proj4.id, location: 'Warehouse', crew: '5', time: '9:00 AM - 3:00 PM', status: 'Confirmed' } })
  await prisma.scheduleEvent.create({ data: { date: 10, title: 'Local Coffee - Product Shoot', projectId: proj3.id, location: 'Coffee Shop', crew: '4', time: '11:00 AM - 5:00 PM', status: 'Confirmed' } })
  await prisma.scheduleEvent.create({ data: { date: 12, title: 'Adidas Winter Promo Prep', projectId: proj6.id, location: 'Studio B', crew: '2', time: '1:00 PM - 4:00 PM', status: 'Tentative' } })
  await prisma.scheduleEvent.create({ data: { date: 15, title: 'Nike Summer - Final Day', projectId: proj1.id, location: 'Studio A', crew: '10', time: '7:00 AM - 8:00 PM', status: 'Confirmed' } })

  // Expenses
  await prisma.expense.create({ data: { description: 'Camera Lens Rental - ARRI 50mm', department: 'Equipment', amount: 4500, requestedBy: 'Jordan Chen', date: 'Oct 12, 2026', status: 'Pending' } })
  await prisma.expense.create({ data: { description: 'Location Fee - Downtown Studio', department: 'Production', amount: 8000, requestedBy: 'Elena Rodriguez', date: 'Oct 11, 2026', status: 'Pending' } })
  await prisma.expense.create({ data: { description: 'Catering - 3 Day Shoot', department: 'Production', amount: 3200, requestedBy: 'David Kim', date: 'Oct 10, 2026', status: 'Approved' } })
  await prisma.expense.create({ data: { description: 'Drone Operator - Aerial Footage', department: 'Talent', amount: 6500, requestedBy: 'Amanda Foster', date: 'Oct 9, 2026', status: 'Pending' } })
  await prisma.expense.create({ data: { description: 'Color Grading Suite Rental', department: 'Post-Production', amount: 2800, requestedBy: 'Sam Wilson', date: 'Oct 8, 2026', status: 'Rejected' } })

  // Invoices
  await prisma.invoice.create({ data: { id: 'INV-001', clientId: nike.id, clientName: nike.name, amount: 45000, date: 'Oct 1, 2026', dueDate: 'Oct 30, 2026', status: 'Pending', items: 'Summer Campaign - Production' } })
  await prisma.invoice.create({ data: { id: 'INV-002', clientId: techcorp.id, clientName: techcorp.name, amount: 28000, date: 'Sep 25, 2026', dueDate: 'Oct 25, 2026', status: 'Overdue', items: 'Product Launch - Pre-Production' } })
  await prisma.invoice.create({ data: { id: 'INV-003', clientId: localCoffee.id, clientName: localCoffee.name, amount: 8500, date: 'Sep 15, 2026', dueDate: 'Oct 15, 2026', status: 'Paid', items: 'Brand Story - Post-Production' } })
  await prisma.invoice.create({ data: { id: 'INV-004', clientId: spotify.id, clientName: spotify.name, amount: 65000, date: 'Oct 5, 2026', dueDate: 'Nov 4, 2026', status: 'Pending', items: 'Artist Spotlight - Pre-Production' } })
  await prisma.invoice.create({ data: { id: 'INV-005', clientId: puma.id, clientName: puma.name, amount: 32000, date: 'Aug 1, 2026', dueDate: 'Aug 31, 2026', status: 'Paid', items: 'Training Series - Completed' } })
  await prisma.invoice.create({ data: { id: 'INV-006', clientId: adidas.id, clientName: adidas.name, amount: 55000, date: 'Oct 10, 2026', dueDate: 'Nov 9, 2026', status: 'Pending', items: 'Holiday Campaign - Production' } })

  // Payments
  await prisma.payment.create({ data: { id: 'PAY-001', invoiceId: 'INV-003', clientId: localCoffee.id, clientName: localCoffee.name, amount: 8500, date: 'Oct 10, 2026', method: 'Wire Transfer', status: 'Completed' } })
  await prisma.payment.create({ data: { id: 'PAY-002', invoiceId: 'INV-005', clientId: puma.id, clientName: puma.name, amount: 32000, date: 'Aug 28, 2026', method: 'Credit Card', status: 'Completed' } })
  await prisma.payment.create({ data: { id: 'PAY-003', invoiceId: 'INV-001', clientId: nike.id, clientName: nike.name, amount: 15000, date: 'Oct 15, 2026', method: 'Check', status: 'Pending' } })
  await prisma.payment.create({ data: { id: 'PAY-004', invoiceId: 'INV-002', clientId: techcorp.id, clientName: techcorp.name, amount: 28000, date: 'Oct 20, 2026', method: 'Wire Transfer', status: 'Pending' } })

  // Assets
  const assetFolders = {
    footage: [
      { name: 'Nike_Shoot_Day1.mov', type: 'Video', folder: 'footage', projectId: proj1.id, uploadedBy: 'Elena R.', date: 'Jun 5', size: '24.5 GB' },
      { name: 'Nike_Shoot_Day2.mov', type: 'Video', folder: 'footage', projectId: proj1.id, uploadedBy: 'David K.', date: 'Jun 6', size: '31.2 GB' },
      { name: 'TechCorp_Broll.mp4', type: 'Video', folder: 'footage', projectId: proj2.id, uploadedBy: 'Sam Wilson', date: 'Jun 3', size: '8.7 GB' },
      { name: 'Spotify_Interview_ProRes.mov', type: 'Video', folder: 'footage', projectId: proj4.id, uploadedBy: 'Mike T.', date: 'Jun 1', size: '45.0 GB' },
    ],
    photos: [
      { name: 'Nike_Location_Scout_01.jpg', type: 'Image', folder: 'photos', projectId: proj1.id, uploadedBy: 'Anna P.', date: 'Jun 4', size: '8.2 MB' },
      { name: 'TechCorp_Product_Shots.zip', type: 'Archive', folder: 'photos', projectId: proj2.id, uploadedBy: 'Jordan C.', date: 'Jun 2', size: '156 MB' },
    ],
    audio: [
      { name: 'Nike_VO_Take1.wav', type: 'Audio', folder: 'audio', projectId: proj1.id, uploadedBy: 'Mike T.', date: 'Jun 7', size: '245 MB' },
      { name: 'Spotify_Narration_Final.wav', type: 'Audio', folder: 'audio', projectId: proj4.id, uploadedBy: 'Sam Wilson', date: 'Jun 4', size: '512 MB' },
    ],
    graphics: [
      { name: 'Nike_Logo_Animation.mov', type: 'Motion', folder: 'graphics', projectId: proj1.id, uploadedBy: 'Lisa M.', date: 'Jun 6', size: '1.2 GB' },
    ],
    documents: [
      { name: 'Nike_Call_Sheet_Day1.pdf', type: 'PDF', folder: 'documents', projectId: proj1.id, uploadedBy: 'Elena R.', date: 'Jun 5', size: '2.4 MB' },
      { name: 'TechCorp_Script_V3.docx', type: 'Document', folder: 'documents', projectId: proj2.id, uploadedBy: 'Jordan C.', date: 'Jun 2', size: '1.8 MB' },
    ],
    edits: [
      { name: 'Nike_Summer_Rough_Cut.mov', type: 'Video', folder: 'edits', projectId: proj1.id, uploadedBy: 'Sam Wilson', date: 'Jun 7', size: '156 GB' },
      { name: 'Spotify_Doc_Assembly.mov', type: 'Video', folder: 'edits', projectId: proj4.id, uploadedBy: 'Sam Wilson', date: 'Jun 5', size: '89 GB' },
    ],
  }
  for (const [_folder, assets] of Object.entries(assetFolders)) {
    for (const a of assets) await prisma.asset.create({ data: a })
  }

  // Conversations
  const conv1 = await prisma.conversation.create({ data: { name: 'Jordan Chen', role: 'Production Manager', projectId: proj1.id, avatar: 'JC', lastMessage: 'The rough cut looks great! Just a few notes...', time: '2m ago', unread: 2, online: true } })
  const conv2 = await prisma.conversation.create({ data: { name: 'Elena Rodriguez', role: 'Director', projectId: proj1.id, avatar: 'ER', lastMessage: 'Location scouting is done for Nike tomorrow.', time: '1h ago', unread: 0, online: true } })
  const conv3 = await prisma.conversation.create({ data: { name: 'Alex Rivera', role: 'Super Admin', projectId: proj1.id, avatar: 'AR', lastMessage: 'New budget approval needed for equipment rental.', time: '3h ago', unread: 1, online: false } })
  const conv4 = await prisma.conversation.create({ data: { name: 'Morgan Chase', role: 'Client (Nike)', projectId: proj1.id, avatar: 'MC', lastMessage: 'Looking forward to the campaign preview.', time: '1d ago', unread: 1, online: false } })

  // Messages
  await prisma.message.create({ data: { conversationId: conv1.id, sender: 'Jordan Chen', text: 'Hey! Just finished the rough cut for the Nike campaign.', time: '10:30 AM', isMe: false, senderId: manager.id } })
  await prisma.message.create({ data: { conversationId: conv1.id, sender: 'Sam Wilson', text: 'Awesome, send it over!', time: '10:32 AM', isMe: true, senderId: crew1.id } })
  await prisma.message.create({ data: { conversationId: conv1.id, sender: 'Jordan Chen', text: 'The rough cut looks great! Just a few notes on the color grading.', time: '10:35 AM', isMe: false, senderId: manager.id } })
  await prisma.message.create({ data: { conversationId: conv2.id, sender: 'Elena Rodriguez', text: 'Location scouting is done for Nike tomorrow.', time: '12:00 PM', isMe: false, senderId: crew1.id } })
  await prisma.message.create({ data: { conversationId: conv3.id, sender: 'Alex Rivera', text: 'New budget approval needed for equipment rental.', time: '9:00 AM', isMe: false, senderId: admin.id } })
  await prisma.message.create({ data: { conversationId: conv4.id, sender: 'Morgan Chase', text: 'Looking forward to the campaign preview next week.', time: '3:00 PM', isMe: false, senderId: clientUser.id } })

  console.log('Seed complete!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())