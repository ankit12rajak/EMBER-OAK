const fs = require('fs');
const path = require('path');

const menuItems = {
  'm1': { name: 'Paneer Tikka', price: 345 },
  'm2': { name: 'Chicken Seekh Kebab', price: 395 },
  'm3': { name: 'Crispy Calamari', price: 425 },
  'm4': { name: 'Vegetable Spring Rolls', price: 275 },
  'm5': { name: 'Mutton Galouti Kebab', price: 495 },
  'm6': { name: 'Hara Bhara Kebab', price: 295 },
  'm7': { name: 'Tomato Basil Soup', price: 195 },
  'm8': { name: 'Hot & Sour Chicken Soup', price: 225 },
  'm9': { name: 'Mushroom Cappuccino', price: 245 },
  'm10': { name: 'Seafood Chowder', price: 325 },
  'm11': { name: 'Caesar Salad', price: 325 },
  'm12': { name: 'Greek Salad', price: 295 },
  'm13': { name: 'Grilled Chicken Salad', price: 375 },
  'm14': { name: 'Quinoa Avocado Bowl', price: 395 },
  'm15': { name: 'Butter Chicken', price: 445 },
  'm16': { name: 'Paneer Butter Masala', price: 375 },
  'm17': { name: 'Lamb Rogan Josh', price: 545 },
  'm18': { name: 'Dal Makhani', price: 295 },
  'm19': { name: 'Fish Curry (Goan)', price: 475 },
  'm20': { name: 'Chicken Biryani', price: 425 },
  'm21': { name: 'Spaghetti Carbonara', price: 395 },
  'm22': { name: 'Penne Arrabbiata', price: 345 },
  'm23': { name: 'Chicken Alfredo', price: 425 },
  'm24': { name: 'Mushroom Truffle Pasta', price: 475 },
  'm25': { name: 'Margherita', price: 345 },
  'm26': { name: 'Pepperoni Pizza', price: 445 },
  'm27': { name: 'BBQ Chicken Pizza', price: 475 },
  'm28': { name: 'Four Cheese Pizza', price: 425 },
  'm29': { name: 'Grilled Salmon', price: 695 },
  'm30': { name: 'Tandoori Chicken', price: 445 },
  'm31': { name: 'Lamb Chops', price: 745 },
  'm32': { name: 'Grilled Vegetable Platter', price: 395 },
  'm33': { name: 'Tiramisu', price: 345 },
  'm34': { name: 'Gulab Jamun', price: 195 },
  'm35': { name: 'Chocolate Lava Cake', price: 375 },
  'm36': { name: 'Mango Panna Cotta', price: 295 },
  'm37': { name: 'Rasmalai', price: 225 },
  'm38': { name: 'Fresh Lime Soda', price: 145 },
  'm39': { name: 'Mango Lassi', price: 175 },
  'm40': { name: 'Cold Coffee', price: 195 },
  'm41': { name: 'Virgin Mojito', price: 225 },
  'm42': { name: 'Masala Chai', price: 95 },
  'm43': { name: 'Truffle Mushroom Risotto', price: 595 },
  'm44': { name: 'Lobster Thermidor', price: 1295 },
  'm45': { name: 'Wagyu Beef Steak', price: 1895 },
};

const customers = [
  { id: 'c1', name: 'Rahul Sharma' }, { id: 'c2', name: 'Priya Patel' }, { id: 'c3', name: 'Amit Kumar' },
  { id: 'c4', name: 'Sneha Reddy' }, { id: 'c5', name: 'Vikram Singh' }, { id: 'c6', name: 'Ananya Gupta' },
  { id: 'c7', name: 'Rohan Mehta' }, { id: 'c8', name: 'Kavitha Nair' }, { id: 'c9', name: 'Arjun Rao' },
  { id: 'c10', name: 'Deepika Joshi' }, { id: 'c11', name: 'Suresh Iyer' }, { id: 'c12', name: 'Meera Kapoor' },
  { id: 'c13', name: 'Rajesh Verma' }, { id: 'c14', name: 'Pooja Desai' }, { id: 'c15', name: 'Karthik Menon' },
  { id: 'c16', name: 'Nisha Agarwal' }, { id: 'c17', name: 'Aditya Bhat' }, { id: 'c18', name: 'Swathi Pillai' },
  { id: 'c19', name: 'Manish Tiwari' }, { id: 'c20', name: 'Ritu Saxena' }, { id: 'c21', name: 'Sanjay Kulkarni' },
  { id: 'c22', name: 'Divya Chauhan' }, { id: 'c23', name: 'Nikhil Jain' }, { id: 'c24', name: 'Lakshmi Sundaram' },
  { id: 'c25', name: 'Varun Malhotra' }, { id: 'c26', name: 'Anjali Mukherjee' }, { id: 'c27', name: 'Prasad Hegde' },
  { id: 'c28', name: 'Shruti Bansal' }, { id: 'c29', name: 'Gaurav Pandey' }, { id: 'c30', name: 'Tanvi Choudhary' },
  { id: 'c31', name: 'Vivek Srinivasan' }, { id: 'c32', name: 'Neha Khanna' }, { id: 'c33', name: 'Harish Gowda' },
  { id: 'c34', name: 'Pallavi Deshpande' }, { id: 'c35', name: 'Ashwin Nambiar' }
];

const tables = [];
for (let i = 1; i <= 4; i++) tables.push({ id: `t${i}`, cap: 2, num: i });
for (let i = 5; i <= 10; i++) tables.push({ id: `t${i}`, cap: 4, num: i });
for (let i = 11; i <= 14; i++) tables.push({ id: `t${i}`, cap: 6, num: i });
for (let i = 15; i <= 16; i++) tables.push({ id: `t${i}`, cap: 8, num: i });
tables.push({ id: 't17', cap: 8, num: 17 });
tables.push({ id: 't18', cap: 10, num: 18 });

const popularItems = ['m15', 'm20', 'm16', 'm23', 'm29', 'm35'];
const beverageItems = ['m38', 'm39', 'm40', 'm41', 'm42'];
const rareItems = ['m43', 'm44', 'm45'];
const otherItems = Object.keys(menuItems).filter(m => !popularItems.includes(m) && !beverageItems.includes(m) && !rareItems.includes(m));

function getRandomItem() {
  const r = Math.random();
  if (r < 0.4) return popularItems[Math.floor(Math.random() * popularItems.length)];
  if (r < 0.6) return beverageItems[Math.floor(Math.random() * beverageItems.length)];
  if (r < 0.95) return otherItems[Math.floor(Math.random() * otherItems.length)];
  return rareItems[Math.floor(Math.random() * rareItems.length)];
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

let allOrders = [];
let today = new Date('2026-10-04T12:00:00Z');

for (let i = 1; i <= 120; i++) {
  let orderNumber = 1000 + i;
  let id = `ord-${String(i).padStart(3, '0')}`;
  
  let numItems = Math.floor(Math.random() * 4) + 2; // 2 to 5 items
  let items = [];
  let subtotal = 0;
  
  let chosenItemIds = new Set();
  while (items.length < numItems) {
    let mId = getRandomItem();
    if (!chosenItemIds.has(mId)) {
      chosenItemIds.add(mId);
      let qty = Math.floor(Math.random() * 3) + 1; // 1 to 3
      let price = menuItems[mId].price;
      items.push({
        menuItemId: mId,
        name: menuItems[mId].name,
        price: price,
        quantity: qty
      });
      subtotal += price * qty;
    }
  }
  
  let tax = Math.round(subtotal * 0.05);
  let discount = Math.random() < 0.2 ? Math.round(subtotal * 0.10) : 0;
  let total = subtotal + tax - discount;
  
  let table = tables[Math.floor(Math.random() * tables.length)];
  let customer = customers[Math.floor(Math.random() * customers.length)];
  
  let status, paymentStatus, paymentMethod;
  let createdAt, completedAt = null;
  
  if (i <= 100) {
    status = 'COMPLETED'; paymentStatus = 'PAID';
    createdAt = randomDate(new Date('2026-04-01'), new Date('2026-10-02'));
  } else if (i <= 105) {
    status = 'COMPLETED'; paymentStatus = 'PAID';
    createdAt = randomDate(new Date('2026-10-03'), new Date('2026-10-04T10:00:00Z'));
  } else if (i <= 108) {
    status = 'SERVED'; paymentStatus = 'PENDING';
    createdAt = new Date('2026-10-04T20:15:00+05:30');
  } else if (i <= 112) {
    status = 'READY'; paymentStatus = 'PENDING';
    createdAt = new Date('2026-10-04T20:30:00+05:30');
  } else if (i <= 116) {
    status = 'PREPARING'; paymentStatus = 'PENDING';
    createdAt = new Date('2026-10-04T20:45:00+05:30');
  } else if (i <= 119) {
    status = 'NEW'; paymentStatus = 'PENDING';
    createdAt = new Date('2026-10-04T21:05:00+05:30');
  } else {
    status = 'CANCELLED'; paymentStatus = 'PENDING';
    createdAt = new Date('2026-10-04T19:00:00+05:30');
  }
  
  if (status === 'COMPLETED') {
    completedAt = new Date(createdAt.getTime() + (Math.floor(Math.random() * 60) + 30) * 60000); // 30-90 min later
    let pm = Math.random();
    if (pm < 0.4) paymentMethod = 'UPI';
    else if (pm < 0.65) paymentMethod = 'Credit Card';
    else if (pm < 0.85) paymentMethod = 'Cash';
    else paymentMethod = 'Debit Card';
  }
  
  let order = {
    id,
    orderNumber,
    tableId: table.id,
    customerId: customer.id,
    items,
    subtotal,
    tax,
    discount,
    total,
    status,
    paymentStatus,
    ...(paymentMethod && { paymentMethod }),
    createdAt: createdAt.toISOString(),
    ...(completedAt && { completedAt: completedAt.toISOString() })
  };
  
  allOrders.push(order);
}

const ordersStr = `import { Order } from '../types';\n\nexport const orders: Order[] = ${JSON.stringify(allOrders, null, 2).replace(/"([^"]+)":/g, '$1:')};`;
fs.mkdirSync(path.join('d:', 'Resturant Demo', 'src', 'data'), { recursive: true });
fs.writeFileSync(path.join('d:', 'Resturant Demo', 'src', 'data', 'orderData.ts'), ordersStr);

let allReservations = [];
const specialReqs = ['Birthday celebration', 'Anniversary dinner', 'Window seat preferred', 'Vegetarian menu only', 'High chair needed', undefined, undefined, undefined];

for (let i = 1; i <= 55; i++) {
  let id = `res-${String(i).padStart(3, '0')}`;
  let table = tables[Math.floor(Math.random() * tables.length)];
  let customer = customers[Math.floor(Math.random() * customers.length)];
  
  let guests = Math.floor(Math.random() * table.cap) + 1;
  let status, date;
  
  if (i <= 35) {
    status = 'COMPLETED';
    date = randomDate(new Date('2026-04-01'), new Date('2026-10-02'));
  } else if (i <= 40) {
    status = 'CANCELLED';
    date = randomDate(new Date('2026-04-01'), new Date('2026-10-02'));
  } else if (i <= 45) {
    status = 'NO_SHOW';
    date = randomDate(new Date('2026-04-01'), new Date('2026-10-02'));
  } else if (i <= 50) {
    status = 'CONFIRMED';
    date = new Date('2026-10-04T22:00:00+05:30'); // Later today
  } else if (i <= 53) {
    status = 'SEATED';
    date = new Date('2026-10-04T20:30:00+05:30'); // Seated now
  } else {
    status = 'CONFIRMED';
    date = new Date('2026-10-10T19:00:00+05:30'); // Future
  }
  
  let specialRequests = specialReqs[Math.floor(Math.random() * specialReqs.length)];
  
  let res = {
    id,
    customerId: customer.id,
    customerName: customer.name,
    customerPhone: '98765432' + Math.floor(Math.random() * 100).toString().padStart(2, '0'),
    tableId: table.id,
    tableNumber: table.num,
    guests,
    date: date.toISOString().split('T')[0],
    time: date.toISOString().split('T')[1].substring(0, 5),
    status,
    ...(specialRequests && { specialRequests })
  };
  
  allReservations.push(res);
}

const resStr = `import { Reservation } from '../types';\n\nexport const reservations: Reservation[] = ${JSON.stringify(allReservations, null, 2).replace(/"([^"]+)":/g, '$1:')};`;
fs.writeFileSync(path.join('d:', 'Resturant Demo', 'src', 'data', 'reservationData.ts'), resStr);
