import { useState } from "react";
import tickets from "./tickets.json";

function App() {
  const [selectedLayovers, setSelectedLayovers] = useState([]);
  const [selectAll, setSelectAll] = useState(true);
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [cart, setCart] = useState([]);

  const handleCheckboxChange = (event) => {
    const value = parseInt(event.target.value);
    if (event.target.checked) {
      setSelectedLayovers((prev) => [...prev, value]);
    } else {
      setSelectedLayovers((prev) =>
        prev.filter((layover) => layover !== value)
      );
    }
    setSelectAll(false);
  };

  const handleSelectAllChange = (event) => {
    setSelectAll(event.target.checked);
    if (event.target.checked) {
      setSelectedLayovers([]);
    }
  };

  const handleAddToCart = (ticket) => {
    setCart((prev) => [...prev, ticket]);
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesLayovers =
      selectAll || selectedLayovers.length === 0
        ? true
        : selectedLayovers.includes(ticket.layovers);
    const matchesFromCity = ticket.from
      .toLowerCase()
      .includes(fromCity.toLowerCase());
    const matchesToCity = ticket.to
      .toLowerCase()
      .includes(toCity.toLowerCase());
    const notInCart = !cart.some((item) => item.flightId === ticket.flightId);
    return matchesLayovers && matchesFromCity && matchesToCity && notInCart;
  });

  return (
    <div className="min-h-screen flex bg-blue-100 flex-col md:flex-row">
      <div className="w-full md:w-1/4 p-4">
        <div className="rounded-xl p-4 bg-white shadow-md shadow-blue-200">
          <h2 className="text-2xl mb-4 font-bold">Поиск билетов</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Откуда:</label>
            <input
              type="text"
              placeholder="Введите город отправления"
              value={fromCity}
              onChange={(e) => setFromCity(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Куда:</label>
            <input
              type="text"
              placeholder="Введите город прибытия"
              value={toCity}
              onChange={(e) => setToCity(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <h2 className="text-2xl mb-4 font-bold">Количество пересадок</h2>
          <label>
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAllChange}
            />
            Не важно
          </label>
          <div className="flex flex-col">
            {[0, 1, 2, 3].map((layover) => (
              <label key={layover}>
                <input
                  type="checkbox"
                  value={layover}
                  checked={!selectAll && selectedLayovers.includes(layover)}
                  onChange={handleCheckboxChange}
                  disabled={selectAll}
                />
                {layover === 0
                  ? "Без пересадок"
                  : `${layover} пересадк${layover > 1 ? "и" : "а"}`}
              </label>
            ))}
          </div>
        </div>
        <h2 className="text-2xl font-bold mt-8 mb-4">Корзина</h2>
        {cart.map((ticket) => (
          <div
            key={ticket.flightId}
            className="mb-4 p-4 bg-gray-200 rounded-lg shadow-md shadow-blue-200 flex"
          >
            <div className="w-4/5">
              <p className="text-xl font-semibold">
                {ticket.from} → {ticket.to}
              </p>
              <p className="text-gray-400">{ticket.startDate}</p>
            </div>
            <p className="text-xl font-bold text-right w-1/5">
              {ticket.price} ₽
            </p>
          </div>
        ))}
      </div>
      <div className="w-full md:w-3/4 p-4 overflow-y-auto md:pl-16">
        <h2 className="text-2xl font-bold mb-4">Доступные билеты</h2>
        {filteredTickets.length === 0 ? (
          <p className="text-xl text-red-500">
            Нет билетов, удовлетворяющих вашим условиям.
          </p>
        ) : (
          filteredTickets.map((ticket) => (
            <div
              key={ticket.flightId}
              className="mb-4 p-4 bg-white rounded-lg shadow-md shadow-blue-200 flex md:w-5/6"
            >
              <div className="w-2/5 md:w-1/5 flex flex-col items-center justify-center border-r pr-4">
                <img
                  src={ticket.img}
                  alt="alt"
                  className="w-full h-32 object-fill pb-2"
                />
                <button
                  className="px-4 py-2 bg-orange-500 text-white rounded w-full break-words text-center max-w-xs"
                  onClick={() => handleAddToCart(ticket)}
                >
                  <span>Купить за {ticket.price} ₽</span>
                </button>
              </div>
              <div className="w-3/5md:w-4/5 pl-4 flex flex-col">
                <div className="flex justify-center items-start mb-4">
                  <p className="text-center">
                    <span className="md:text-lg font-bold">
                      {ticket.layovers === 0
                        ? "Без пересадок"
                        : `${ticket.layovers} пересадк${
                            ticket.layovers > 1 ? "и" : "а"
                          }`}
                    </span>
                  </p>
                </div>
                <div className="flex justify-between">
                  <div>
                    <p className="md:text-4xl font-medium">{ticket.startTime}</p>
                    <p className="md:text-xl font-semibold">{ticket.from}</p>
                    <p className="text-gray-400">{ticket.startDate}</p>
                  </div>
                  <div>
                    <p className="md:text-4xl font-medium">{ticket.endTime}</p>
                    <p className="md:text-xl font-semibold">{ticket.to}</p>
                    <p className="text-gray-400">{ticket.endDate}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
