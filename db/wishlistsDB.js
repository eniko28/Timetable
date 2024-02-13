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
    await db.query(
      `INSERT INTO Wishlists SET 
          wishlistId = '${wishlistId}', 
          teacherId = '${teacherCode}', 
          subjectId = '${subjectCode}', 
          groupId = '${groupCode}', 
          day = '${day}', 
          start = '${start}', 
          end = '${end}'
        `
    );
  } catch (error) {
    console.error("Error inserting wishlist:", error);
    throw error;
  }
}

export async function getAllWishlists(db) {
  try {
    const wishlists = await db.select().from("Wishlists").all();
    return wishlists;
  } catch (error) {
    console.error("Error getting teachers from the database:", error);
    throw error;
  }
}

export async function getWishlistById(db, wishlistId) {
  try {
    const teacher = await db
      .select()
      .from("Wishlists")
      .where({
        wishlistId: wishlistId,
      })
      .one();

    return teacher;
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
    const wishlist = await db.query(
      `SELECT FROM Wishlists WHERE day = '${day}' AND start = '${start}' AND end = '${end}'`
    );

    return wishlist;
  } catch (error) {
    console.error("Error getting subjects from the database:", error);
    throw error;
  }
}

export async function deleteWishlist(db, day, start, end) {
  try {
    await db.query(
      `DELETE VERTEX FROM Wishlists WHERE day = '${day}' AND start = '${start}' AND end = '${end}'`
    );
  } catch (error) {
    console.error("Error deleting wishlist:", error);
    throw error;
  }
}
