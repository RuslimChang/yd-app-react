import React from "react";
import axios from "axios";

function AuthHome({ firstName, lastName }) {
  const handleLogout = () => {
    axios
      .get("http://localhost:8081/logout")
      .then((res) => {
        window.location.reload(true);
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="bg-white p-3 rounded w-25">
      <section id="main">
        <h3 className="text-center">
          Welcome - {firstName} {lastName}
        </h3>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatibus
          esse distinctio, voluptatum ab aliquam porro quisquam pariatur
          necessitatibus corporis voluptas quasi vero vel, et, voluptates atque
          eos enim laboriosam mollitia? Lorem ipsum, dolor sit amet consectetur
          adipisicing elit. Voluptatibus esse distinctio, voluptatum ab aliquam
          porro quisquam pariatur necessitatibus corporis voluptas quasi vero
          vel, et, voluptates atque eos enim laboriosam mollitia? Lorem ipsum,
          dolor sit amet consectetur adipisicing elit. Voluptatibus esse
          distinctio, voluptatum ab aliquam porro quisquam pariatur
          necessitatibus corporis voluptas quasi vero vel, et, voluptates atque
          eos enim laboriosam mollitia? Lorem ipsum, dolor sit amet consectetur
          adipisicing elit. Voluptatibus esse distinctio, voluptatum ab aliquam
          porro quisquam pariatur necessitatibus corporis voluptas quasi vero
          vel, et, voluptates atque eos enim laboriosam mollitia?
        </p>
        <div className="d-grid gap-2">
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </section>
    </div>
  );
}

export default AuthHome;
