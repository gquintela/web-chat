const users = [];

const addUser = ({ id, username, room }) => {
  //mantainance
  username = username.trim().toUpperCase();
  room = room.trim().toUpperCase();

  //validate
  if (!username || !room) {
    return {
      error: "username and room are required",
    };
  }

  ///check for existing users
  const existingUser = users.find((user) => {
    return user.room == room && user.username == username;
  });

  ///validate existing user
  if (existingUser) {
    return {
      error: "username already in use",
    };
  }

  ///store user

  const user = {
    id,
    username,
    room,
  };

  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => {
    return user.id == id;
  });
  if (index != -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id) => {
  return users.find((user) => user.id == id);
};

const getUsersInRoom = (room) => {
  room = room.trim().toUpperCase();
  return users.filter((user) => user.room == room);
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};
