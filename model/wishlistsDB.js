export async function insertWishlist(db, wishlistId, teacherCode, day, start, end) {
  try {
    const query = `INSERT INTO Wishlists SET wishlistId = '${wishlistId}', teacherId = '${teacherCode}', day = '${day}', start = '${start}', end = '${end}', status = 'waiting'`;
    await db.query(query);
  } catch (error) {
    console.error('Error inserting wishlist:', error);
    throw error;
  }
}

export async function getAllWishlists(db) {
  try {
    const query = "SELECT FROM Wishlists WHERE status = 'waiting'";
    const wishlists = await db.query(query);
    return wishlists;
  } catch (error) {
    console.error('Error getting wishlists from the database:', error);
    throw error;
  }
}

export async function getWishlistById(db, wishlistId) {
  try {
    const query = `SELECT FROM Wishlists WHERE wishlistId = '${wishlistId}'`;
    const wishlist = await db.query(query);
    return wishlist.length > 0 ? wishlist[0] : null;
  } catch (error) {
    console.error(`Error getting wishlist with ID ${wishlistId} from the database:`, error);
    throw error;
  }
}

export async function getWishlistByDayandTime(db, day, start, end) {
  try {
    const query = `SELECT FROM Wishlists WHERE day = '${day}' AND start = '${start}' AND end = '${end}'`;
    const wishlist = await db.query(query);
    return wishlist;
  } catch (error) {
    console.error('Error getting wishlists from the database:', error);
    throw error;
  }
}

export async function approvedWishlists(db, day, start, end) {
  try {
    const query = `UPDATE Wishlists SET status = 'approved' WHERE day = '${day}' AND start = '${start}' AND end = '${end}'`;
    await db.query(query);
  } catch (error) {
    console.error('Error deleting wishlist:', error);
    throw error;
  }
}

export async function rejectedWishlists(db, day, start, end) {
  try {
    const query = `UPDATE Wishlists SET status = 'rejected' WHERE day = '${day}' AND start = '${start}' AND end = '${end}'`;
    await db.query(query);
  } catch (error) {
    console.error('Error deleting wishlist:', error);
    throw error;
  }
}
