import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Button,
  CardHeader,
  Switch,
  CardBody,
  Input,
  Textarea,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  getKeyValue,
  Pagination,
  Spinner,
} from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { useTheme } from "next-themes";
import axios from "axios";

import { setItems, addItem, updateItem, deleteItem } from "./store";
import { MoonIcon } from "./assets/MoonIcon";
import { SunIcon } from "./assets/SunIcon";
import { EditIcon } from "./assets/EditIcon";
import { DeleteIcon } from "./assets/DeleteIcon";

export default function App() {
  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch();
  const items = useSelector((state) => state.itemsList);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [readPage, setReadPage] = useState(1);
  const [updatePage, setUpdatePage] = useState(1);
  const [deletePage, setDeletePage] = useState(1);

  const API_URL = process.env.API_URL || "http://localhost:3000";
  console.log("API_URL........", API_URL);

  const readColumns = [
    {
      key: "name",
      label: "NAME",
    },
    {
      key: "description",
      label: "DESCRIPTION",
    },
    {
      key: "price",
      label: "PRICE",
    },
  ];

  const actionColumns = [
    {
      key: "name",
      label: "NAME",
    },
    {
      key: "description",
      label: "DESCRIPTION",
    },
    {
      key: "price",
      label: "PRICE",
    },
    {
      key: "action",
      label: "ACTION",
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    axios.get(`${API_URL}/api/get-items`).then((response) => {
      dispatch(setItems(response.data));
      setIsLoading(false);
      setReadPage(1);
      setUpdatePage(1);
      setDeletePage(1);
    });
  }, []);

  const readRows = () => {
    const rowsPerPage = 4;

    const readItems = useMemo(() => {
      const start = (readPage - 1) * rowsPerPage;
      const end = start + rowsPerPage;
      const slicedItems = items.slice(start, end);

      if (slicedItems.length === 0) {
        setReadPage(Math.ceil(items.length / 4));
        return items;
      }
      return slicedItems;
    }, [readPage, items]);

    return readItems;
  };

  const updateRows = () => {
    const rowsPerPage = 4;

    const updateItems = useMemo(() => {
      const start = (updatePage - 1) * rowsPerPage;
      const end = start + rowsPerPage;
      const slicedItems = items.slice(start, end);

      if (slicedItems.length === 0) {
        setUpdatePage(Math.ceil(items.length / 4));
        return items;
      }
      return slicedItems;
    }, [updatePage, items]);

    return updateItems;
  };

  const deleteRows = () => {
    const rowsPerPage = 4;

    const deleteItems = useMemo(() => {
      const start = (deletePage - 1) * rowsPerPage;
      const end = start + rowsPerPage;
      const slicedItems = items.slice(start, end);

      if (slicedItems.length === 0) {
        setDeletePage(Math.ceil(items.length / 4));
        return items;
      }
      return slicedItems;
    }, [deletePage, items]);

    return deleteItems;
  };

  const readItems = readRows();
  const updateItems = updateRows();
  const deleteItems = deleteRows();

  const triggerNotification = (message, status) => {
    if (status === "error") {
      toast.error(message, {
        duration: 5000,
        position: "top-right",
        style: {
          background: theme === "dark" ? "#e5e7eb" : "#18181b",
          color: theme === "dark" ? "#18181b" : "#e5e7eb",
        },
      });
    } else {
      toast.success(message, {
        duration: 5000,
        position: "top-right",
        style: {
          background: theme === "dark" ? "#e5e7eb" : "#18181b",
          color: theme === "dark" ? "#18181b" : "#e5e7eb",
        },
      });
    }
  };

  const handleCreateItem = (item) => {
    axios
      .post(`${API_URL}/api/create-item`, item)
      .then((response) => {
        dispatch(addItem(response.data.record));
        triggerNotification(response.data.message, "success");
        setName("");
        setDescription("");
        setPrice("");
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data.message.includes("validation failed")
        ) {
          // Handle validation error
          triggerNotification("Item validation failed.", "error");
        } else if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          triggerNotification(
            error.response.data.message || "Server error",
            "error"
          );
        } else if (error.request) {
          // The request was made but no response was received
          triggerNotification("Network error. Please try again.", "error");
        } else {
          // Something happened in setting up the request that triggered an Error
          triggerNotification("An unexpected error occurred", "error");
        }
        console.error("Error creating item:", error);
      });
  };

  const handleDeleteItem = (id) => {
    axios
      .delete(`${API_URL}/api/delete-item/${id}`)
      .then((response) => {
        dispatch(deleteItem(id));
        triggerNotification(response.data.message, "success");
        // setDeletePage(Math.ceil(items.length / 4));
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          triggerNotification(
            error.response.data.message || "Server error",
            "error"
          );
        } else if (error.request) {
          // The request was made but no response was received
          triggerNotification("Network error. Please try again.", "error");
        } else {
          // Something happened in setting up the request that triggered an Error
          triggerNotification("An unexpected error occurred", "error");
        }
        console.error("Error creating item:", error);
      });
  };

  return (
    <div className="flex flex-col justify-center bg-background p-5">
      <p className="text-lg">
        Built with React NextUI and{" "}
        <span className="text-pink-300 uppercase text-xl font-bold">
          {process.env.BACKEND_FRAMEWORK || "Put Backend Framework Here"}
        </span>
      </p>
      <div className="my-6 flex mx-auto gap-10">
        <h1 className="text-3xl font-bold">CRUD APP</h1>
        <Switch
          aria-label="Toggle theme"
          defaultSelected={theme === "dark"}
          size="md"
          color="default"
          startContent={<SunIcon />}
          endContent={<MoonIcon />}
          onValueChange={(isSelected) =>
            setTheme(isSelected ? "dark" : "light")
          }
        />
      </div>
      <div className="flex flex-wrap gap-4 justify-center">
        {/* CREATE */}
        <Card className="w-[49%] min-w-96">
          <CardHeader>
            <h1 className="text-2xl font-bold uppercase underline">Create</h1>
          </CardHeader>
          <CardBody>
            <Card className="min-h-[420px]">
              <CardHeader>
                <div className="flex flex-col">
                  <h1 className="text-xl font-bold">Add New Item</h1>
                  <p>Fill out the form to create a new item.</p>
                </div>
              </CardHeader>
              <CardBody>
                <div className="flex flex-col gap-4">
                  <Input
                    isRequired
                    label="Name"
                    aria-label="Name"
                    variant="bordered"
                    placeholder="Enter name"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                  />
                  <Textarea
                    isRequired
                    label="Description"
                    aria-label="Description"
                    variant="bordered"
                    placeholder="Enter description"
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                  />
                  <Input
                    isRequired
                    type="text"
                    label="Price"
                    aria-label="Price"
                    variant="bordered"
                    placeholder="Enter price"
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(
                        /[^0-9]/g,
                        ""
                      );
                      setPrice(numericValue);
                    }}
                    value={price}
                  />
                </div>
                <Button
                  className="my-4 font-bold w-1/6"
                  onClick={() =>
                    handleCreateItem({
                      name: name,
                      description: description,
                      price: price,
                    })
                  }
                  aria-label="Create item"
                >
                  Create
                </Button>
                <Toaster />
              </CardBody>
            </Card>
          </CardBody>
        </Card>
        {/* READ */}
        <Card className="w-[49%] min-w-96">
          <CardHeader>
            <h1 className="text-2xl font-bold uppercase underline">Read</h1>
          </CardHeader>
          <CardBody>
            <Card className="min-h-[420px]">
              <CardHeader className="flex justify-between">
                <div className="flex flex-col">
                  <h1 className="text-xl font-bold">Items List</h1>
                  <p>View the list of items in the database.</p>
                </div>
              </CardHeader>
              <CardBody className="px-1">
                <Table shadow="none" className="w-full min-h-56">
                  <TableHeader columns={readColumns}>
                    {(column) => (
                      <TableColumn key={column.key}>{column.label}</TableColumn>
                    )}
                  </TableHeader>
                  {items.length === 0 ? (
                    <TableBody emptyContent={"No rows to display."}>
                      {[]}
                    </TableBody>
                  ) : (
                    <TableBody
                      items={readItems}
                      isLoading={isLoading}
                      loadingContent={
                        <Spinner label="Loading..." color="current" />
                      }
                    >
                      {(item) => (
                        <TableRow key={item._id}>
                          {(columnKey) => (
                            <TableCell>
                              {columnKey === "price"
                                ? `₹${getKeyValue(item, columnKey)}`
                                : getKeyValue(item, columnKey)}
                            </TableCell>
                          )}
                        </TableRow>
                      )}
                    </TableBody>
                  )}
                </Table>
                {readItems.length > 0 && (
                  <Pagination
                    isCompact
                    showControls
                    total={Math.ceil(items.length / 4)}
                    page={readPage}
                    onChange={(page) => setReadPage(page)}
                    color="default"
                    initialPage={1}
                    className="mx-auto my-4"
                    aria-label="Items pagination"
                  />
                )}
              </CardBody>
            </Card>
          </CardBody>
        </Card>
        {/* UPDATE */}
        <Card className="w-[49%] min-w-96">
          <CardHeader>
            <h1 className="text-2xl font-bold uppercase underline">UPDATE</h1>
          </CardHeader>
          <CardBody>
            <Card className="min-h-[420px]">
              <CardHeader>
                <div className="flex flex-col">
                  <h1 className="text-xl font-bold">Update Item</h1>
                  <p>Select an item to update from the database.</p>
                </div>
              </CardHeader>
              <CardBody className="px-1">
                <Table shadow="none" className="w-full min-h-56">
                  <TableHeader columns={actionColumns}>
                    {(column) => (
                      <TableColumn key={column._id}>{column.label}</TableColumn>
                    )}
                  </TableHeader>
                  {items.length === 0 ? (
                    <TableBody emptyContent={"No rows to display."}>
                      {[]}
                    </TableBody>
                  ) : (
                    <TableBody
                      items={updateItems}
                      isLoading={isLoading}
                      loadingContent={
                        <Spinner label="Loading..." color="current" />
                      }
                    >
                      {(item) => (
                        <TableRow key={item._id}>
                          {(columnKey) => (
                            <TableCell>
                              {columnKey === "action" ? (
                                <EditIcon
                                  id={item._id}
                                  triggerNotification={triggerNotification}
                                />
                              ) : columnKey === "price" ? (
                                `₹${getKeyValue(item, columnKey)}`
                              ) : (
                                getKeyValue(item, columnKey)
                              )}
                            </TableCell>
                          )}
                        </TableRow>
                      )}
                    </TableBody>
                  )}
                </Table>
                {updateItems.length > 0 && (
                  <Pagination
                    isCompact
                    showControls
                    total={Math.ceil(items.length / 4)}
                    page={updatePage}
                    onChange={(page) => setUpdatePage(page)}
                    color="default"
                    initialPage={1}
                    className="mx-auto my-4"
                    aria-label="Delete items pagination"
                  />
                )}
              </CardBody>
            </Card>
          </CardBody>
        </Card>
        {/* DELETE */}
        <Card className="w-[49%] min-w-96">
          <CardHeader>
            <h1 className="text-2xl font-bold uppercase underline">Delete</h1>
          </CardHeader>
          <CardBody>
            <Card className="min-h-[420px]">
              <CardHeader>
                <div className="flex flex-col">
                  <h1 className="text-xl font-bold">Delete Item</h1>
                  <p>Select an item to delete from the database.</p>
                </div>
              </CardHeader>
              <CardBody className="px-1">
                <Table shadow="none" className="w-full min-h-56">
                  <TableHeader columns={actionColumns}>
                    {(column) => (
                      <TableColumn key={column._id}>{column.label}</TableColumn>
                    )}
                  </TableHeader>
                  {items.length === 0 ? (
                    <TableBody emptyContent={"No rows to display."}>
                      {[]}
                    </TableBody>
                  ) : (
                    <TableBody
                      items={deleteItems}
                      isLoading={isLoading}
                      loadingContent={
                        <Spinner label="Loading..." color="current" />
                      }
                    >
                      {(item) => (
                        <TableRow key={item._id}>
                          {(columnKey) => (
                            <TableCell>
                              {columnKey === "action" ? (
                                <DeleteIcon
                                  onClick={() => handleDeleteItem(item._id)}
                                />
                              ) : columnKey === "price" ? (
                                `₹${getKeyValue(item, columnKey)}`
                              ) : (
                                getKeyValue(item, columnKey)
                              )}
                            </TableCell>
                          )}
                        </TableRow>
                      )}
                    </TableBody>
                  )}
                </Table>
                {deleteItems.length > 0 && (
                  <Pagination
                    isCompact
                    showControls
                    total={Math.ceil(items.length / 4)}
                    page={deletePage}
                    onChange={(page) => setDeletePage(page)}
                    color="default"
                    initialPage={1}
                    className="mx-auto my-4"
                    aria-label="Delete items pagination"
                  />
                )}
              </CardBody>
            </Card>
          </CardBody>
        </Card>
      </div>

      <footer className="mt-8 text-center text-gray-500">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} CRUD App. All rights reserved.
        </p>
        <p className="text-sm">
          Source code:{" "}
          <a
            href="https://github.com/karthikeya0800/CRUD-Node"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "skyblue", textDecoration: "underline" }}
          >
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
