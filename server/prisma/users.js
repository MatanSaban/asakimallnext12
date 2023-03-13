import prisma from ".";
import bcrypt from 'bcrypt'

export async function getUsers() {
  try {
    const users = await prisma.users.findMany();
    return { users };
  } catch (error) {
    return { error };
  }
}

export async function createUser(user) {
  try {
    const userFromDB = await prisma.users.create({ data: user });
    return { user: userFromDB };
  } catch (error) {
    return { error };
  }
}

export async function getUserById(id,password) {
  try {
    const user = await prisma.users.findUnique({ where: { id } });
    return { user };
  } catch (error) {
    return { error };
  }
}

export async function getUserByMail(email, password) {
  try {
    let returnValue;
    if (email !== '' || password !== '') {
      const user = await prisma.users.findUnique({ where: { email } });
      if (user && user.password) {
        await bcrypt.compare(password, user.password).then(result => {
          if (result) {
            let userWithoutPass;
            Object.keys(user).map(key => {
              if (key === "password") {
                delete user[key];
              }
              return userWithoutPass = user;
            });
            return returnValue = {data:userWithoutPass};
          } else {
            throw new Error("credentials are not correct or not exist");
          }
        })
        return returnValue
      } else {
        throw new Error("credentials are not correct or not exist");
      }
    } else {
      throw new Error("credentials are not set properly");
    }
  } catch (error) {
    return { error };
  }
}
export async function getUserByToken(token) {
  try {
    let returnValue;
    const user = await prisma.users.findUnique({ where: {token:token} });
    console.log('user')
    console.log(user)
    if (user && user.id) {
        let userWithoutPass;
        Object.keys(user).map(key => {
          if (key === "password") {
            delete user[key]; 
          }
              console.log('userWithoutPass')
              console.log(userWithoutPass)
              return userWithoutPass = user;
            });
            return returnValue = {user:userWithoutPass};
      } else {
        throw new Error("credentials are not correct or not exist");
      }
  } catch (error) {
    return { error };
  }
}

export async function updateUser(id, data) {
  
  try {
    const updatedUser = await prisma.users.update({
      where: {
        id: id,
      },
      data: data,
    });
    return { updatedUser };
  } catch (error) {
    return error;
  }
}

export async function deleteUser(id) {
  try {
    const user = await prisma.users.delete({ where: { id } });
    return { user };
  } catch (error) {
    return { error };
  }
}


export async function getAllUsersForExistChecking() {
  try {
    const users = await prisma.users.findMany();
    return { users };
  } catch (error) {
    return { error };
  }

}