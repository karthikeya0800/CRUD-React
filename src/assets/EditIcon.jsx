import {
  Button,
  Card,
  CardBody,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Textarea,
  Tooltip,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { updateItem } from "../store";
import axios from "axios";

export const EditIcon = (props) => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.itemsList);

  const selectedItem = items.find((item) => item._id === props.id);
  const [name, setName] = useState(selectedItem.name);
  const [description, setDescription] = useState(selectedItem.description);
  const [price, setPrice] = useState(selectedItem.price);
  const [isOpen, setIsOpen] = useState(false);

  const handleUpdateItem = (id, updatedItem) => {
    axios
      .put(`${process.env.API_URL}/api/update-item/${id}`, updatedItem)
      .then((response) => {
        dispatch(updateItem({ _id: id, ...updatedItem }));
        props.triggerNotification("Item Updated Successfully", "success");
        setIsOpen(false);
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data.message.includes("validation failed")
        ) {
          // Handle validation error
          props.triggerNotification("Item validation failed.", "error");
        } else if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          props.triggerNotification(
            error.response.data.message || "Server error",
            "error"
          );
        } else if (error.request) {
          // The request was made but no response was received
          props.triggerNotification(
            "Network error. Please try again.",
            "error"
          );
        } else {
          // Something happened in setting up the request that triggered an Error
          props.triggerNotification("An unexpected error occurred", "error");
        }
        console.error("Error updating item:", error);
      });
  };

  return (
    <Tooltip content="Edit Record" color="success" placement="right" showArrow>
      <span className="text-lg text-success cursor-pointer active:opacity-50">
        <Popover
          placement="left"
          showArrow={true}
          isOpen={isOpen}
          onOpenChange={setIsOpen}
        >
          <PopoverTrigger>
            <svg
              aria-hidden="true"
              fill="none"
              focusable="false"
              height="1em"
              role="presentation"
              viewBox="0 0 20 20"
              width="1em"
            >
              <path
                d="M11.05 3.00002L4.20835 10.2417C3.95002 10.5167 3.70002 11.0584 3.65002 11.4334L3.34169 14.1334C3.23335 15.1084 3.93335 15.775 4.90002 15.6084L7.58335 15.15C7.95835 15.0834 8.48335 14.8084 8.74168 14.525L15.5834 7.28335C16.7667 6.03335 17.3 4.60835 15.4583 2.86668C13.625 1.14168 12.2334 1.75002 11.05 3.00002Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit={10}
                strokeWidth={1.5}
              />
              <path
                d="M9.90833 4.20831C10.2667 6.50831 12.1333 8.26665 14.45 8.49998"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit={10}
                strokeWidth={1.5}
              />
              <path
                d="M2.5 18.3333H17.5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit={10}
                strokeWidth={1.5}
              />
            </svg>
          </PopoverTrigger>
          <PopoverContent>
            <Card shadow="none" className="max-w-96">
              <CardBody>
                <div className="flex flex-col gap-4">
                  <Input
                    label="Name"
                    variant="bordered"
                    placeholder="Enter name"
                    aria-label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    isRequired
                  />
                  <Textarea
                    label="Description"
                    variant="bordered"
                    placeholder="Enter description"
                    aria-label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    isRequired
                  />
                  <Input
                    label="Price"
                    variant="bordered"
                    placeholder="Enter price"
                    aria-label="Price"
                    value={price}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(
                        /[^0-9]/g,
                        ""
                      );
                      setPrice(numericValue);
                    }}
                    isRequired
                  />
                </div>
                <Button
                  className="my-4 font-bold"
                  color="success"
                  aria-label="Update Item"
                  onClick={() =>
                    handleUpdateItem(props.id, {
                      name: name,
                      description: description,
                      price: price,
                    })
                  }
                >
                  <FiRefreshCw color="#18181b" size={20} />
                  <span style={{ color: "#18181b" }}>Update</span>
                </Button>
              </CardBody>
            </Card>
          </PopoverContent>
        </Popover>
      </span>
    </Tooltip>
  );
};
