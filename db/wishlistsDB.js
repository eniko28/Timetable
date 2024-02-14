export async function insertWishlist(
  db,
  wishlistId,
  teacherCode,
  groupCode,
  subjectCode,
  day,
  start,
  end
) {
  try {
    const query = `INSERT INTO Wishlists SET wishlistId = '${wishlistId}', teacherId = '${teacherCode}', subjectId = '${subjectCode}', groupId = '${groupCode}', day = '${day}', start = '${start}', end = '${end}'`;
    await db.query(query);
  } catch (error) {
    console.error("Error inserting wishlist:", error);
    throw error;
  }
}

export async function getAllWishlists(db) {
  try {
    const query = "SELECT FROM Wishlists";
    const wishlists = await db.query(query);
    return wishlists;
  } catch (error) {
    console.error("Error getting wishlists from the database:", error);
    throw error;
  }
}

export async function getWishlistById(db, wishlistId) {
  try {
    const query = `SELECT FROM Wishlists WHERE wishlistId = '${wishlistId}'`;
    const wishlist = await db.query(query);
    return wishlist.length > 0 ? wishlist[0] : null;
  } catch (error) {
    console.error(
      `Error getting wishlist with ID ${wishlistId} from the database:`,
      error
    );
    throw error;
  }
}

export async function getWishlistByDayandTime(db, day, start, end) {
  try {
    const query = `SELECT FROM Wishlists WHERE day = '${day}' AND start = '${start}' AND end = '${end}'`;
    const wishlist = await db.query(query);
    return wishlist;
  } catch (error) {
    console.error("Error getting wishlists from the database:", error);
    throw error;
  }
}

export async function deleteWishlist(db, day, start, end) {
  try {
    const query = `DELETE VERTEX FROM Wishlists WHERE day = '${day}' AND start = '${start}' AND end = '${end}'`;
    await db.query(query);
  } catch (error) {
    console.error("Error deleting wishlist:", error);
    throw error;
  }
}
