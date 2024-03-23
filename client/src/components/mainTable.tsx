import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import AddCitizen from "./addCitizen";
import EditCitizen from "./editCitizen";
import SearchCitizen from "./searchCitizen";
import { Divide, Loader2, Trash2 } from "lucide-react";

// Interface
export interface Citizen {
  _id?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  pincode: number;
}

interface QuerySchema {
  query: string;
  attribute: string;
}

// Main Table logic
export function MainTable() {
  const baseurl = import.meta.env.VITE_BASE_URL; // Remote url
  const [mainData, setMainData] = useState<Citizen[]>([]); // To hold table rows
  const rowsPerPage = 7; // Max rows per page
  const [status, setStatus] = useState("main"); // To differentiate between main & search state
  const [currentIndex, setCurrentIndex] = useState(0); // For pagination
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [beingFetched, setBeingFetch] = useState(false);

  const [queryState, setQueryState] = useState<QuerySchema>({
    query: "",
    attribute: "",
  });

  /**
   * Setters for children component
   *
   * This is the component that handles the pagination logic, no additional pagination
   * logic is handled in the search component, so all the search results are to be
   * sent to this component for being fetched & pagination, so this setter is needed for child to
   * change the state of the parent component
   */

  const querySetter = ({ query, attribute }: QuerySchema) => {
    setQueryState({ query, attribute });
    setMainData([]);
    setStatus("search");
    setCurrentIndex(0);
    setHasReachedEnd(false);
  };

  // Fetches more rows, takes the skip value which is the number of rows already fetched
  const fetchMore = async () => {
    try {
      const response = await fetch(
        `${baseurl}/citizens?skip=${mainData.length}&limit=100`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();

      // A null data means no more rows to fetch, so return without setting and updating current search index
      if (!data) {
        setHasReachedEnd(true);
        return;
      }

      // If payload ever contains results less then rows per page this means we have reached the end
      data.length < rowsPerPage && setHasReachedEnd(true);

      // Set main data - add more rows
      setMainData((prev) => [...prev, ...data]);

      /*
       * mainData.length being a truthy value means we are not fetching
       * for the first time but bringing in another batch, so we can set
       * index to mainData.length, so that new rows
       * brought in can be sliced and shown
       */
      if (mainData.length) {
        setCurrentIndex(mainData.length);
      }
    } catch (error: any) {
      // Not handling errors for now
      console.log(error.message);
    }
  };

  // Same as fetch more but fetches with search query enabled
  const fetchMoreSearch = async () => {
    try {
      const response = await fetch(
        `${baseurl}/citizens?skip=${mainData.length}&limit=100&${queryState.attribute}=${queryState.query}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();

      // A null data means no more rows to fetch, so return without setting and updating current search index
      if (!data) {
        setHasReachedEnd(true);
        return;
      }

      // If payload ever contains results less then rows per page this means we have reached the end
      data.length < rowsPerPage && setHasReachedEnd(true);

      // Set main data - add more rows
      setMainData((prev) => [...prev, ...data]);

      /*
       * mainData.length being a truthy value means we are not fetching
       * for the first time but bringing in another batch, so we can set
       * index to mainData.length, so that new rows
       * brought in can be sliced and shown
       */
      if (mainData.length) {
        setCurrentIndex(mainData.length);
      }
    } catch (error: any) {
      // Not handling errors for now
      console.log(error.message);
    }
  };

  useEffect(() => {
    /*
     * Runs on initial page load, a conditional check
     * is there to prevent react strict mode issues
     */
    if (mainData.length === 0) {
      (async () => {
        setBeingFetch(true);
        await fetchMore();
        setIsLoading(false);
        setBeingFetch(false);
      })();
    }
  }, []);

  // Handles delete citizen logic
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${baseurl}/delete/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      await response.json();

      window.location.reload();
    } catch (error: any) {
      console.log(error.message);
    }
  };

  /*
   * Handles next click logic, this next button
   * works for both mainComponent (this component)
   * and the search component (children component) - based on status state variable
   *
   */

  useEffect(() => {
    // Listen to status changes, and fetch when status is search
    if (status === "search") {
      (async () => {
        setBeingFetch(true);
        await fetchMoreSearch();
        setBeingFetch(false);
      })();
    }
  }, [status, queryState]);

  const handleNextClick = () => {
    if (currentIndex + rowsPerPage >= mainData.length) {
      /*
       * Fetch mores, currentIndex + rowsPerPage equals to mainData.length
       * means that no more rows to show, so the previous payload
       * has been exhausted, time to fetch another batch
       *
       */

      if (queryState.attribute && queryState.query) {
        // If query attributes are present fetch more search results
        fetchMoreSearch();
      } else {
        // Else fetch more normal results
        fetchMore();
      }
    } else {
      // Else move the index and show another page
      setCurrentIndex((prev) =>
        prev + rowsPerPage < mainData.length ? prev + rowsPerPage : prev
      );
    }
  };

  // Show previous page logic, just decrease the index
  const handlePreviousClick = () => {
    setCurrentIndex((prev) =>
      prev - rowsPerPage >= 0 ? prev - rowsPerPage : prev
    );

    currentIndex !== 0 && setHasReachedEnd(false);
  };

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full pt-2">
      <div className="flex justify-between space-x-8 pt-4 px-4">
        <AddCitizen />
        <SearchCitizen querySetter={querySetter} />
      </div>
      <Table className="mt-5">
        <TableHeader>
          <TableRow>
            <TableHead className="">Uid</TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Date of Birth</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>City</TableHead>
            <TableHead>State</TableHead>
            <TableHead className="">Pincode</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            // Slice for pagination
            mainData
              .slice(
                currentIndex,
                currentIndex + rowsPerPage < mainData.length
                  ? currentIndex + rowsPerPage
                  : mainData.length
              )
              .map((citizen) => (
                <TableRow key={citizen._id}>
                  <TableCell className="font-medium">{citizen._id}</TableCell>
                  <TableCell>{citizen.firstName}</TableCell>
                  <TableCell>{citizen.lastName}</TableCell>
                  <TableCell>{citizen.dateOfBirth}</TableCell>
                  <TableCell>{citizen.gender}</TableCell>
                  <TableCell>{citizen.address}</TableCell>
                  <TableCell>{citizen.city}</TableCell>
                  <TableCell>{citizen.state}</TableCell>
                  <TableCell>{citizen.pincode}</TableCell>
                  <TableCell className="flex pl-0 space-x-2 justify-end">
                    <EditCitizen
                      _id={citizen._id}
                      firstName={citizen.firstName}
                      lastName={citizen.lastName}
                      dateOfBirth={citizen.dateOfBirth}
                      gender={citizen.gender}
                      address={citizen.address}
                      city={citizen.city}
                      state={citizen.state}
                      pincode={citizen.pincode}
                    />
                    <Button
                      variant={"ghost"}
                      className="px-[5px]"
                      onClick={() => {
                        handleDelete(citizen._id!);
                      }}
                    >
                      <Trash2 strokeWidth={1.5} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
          }
        </TableBody>
      </Table>
      <div className="flex flex-col items-center mt-2 grow">
        {!mainData.length &&
          (!beingFetched ? (
            <div>No data found!</div>
          ) : (
            <div>
              <Loader2 className="animate-spin" />
            </div>
          ))}
        <div className="mt-2 flex w-full justify-center px-4 space-x-4">
          <Button
            variant="outline"
            size="sm"
            disabled={currentIndex === 0}
            onClick={handlePreviousClick}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            disabled={hasReachedEnd === true}
            size="sm"
            onClick={handleNextClick}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
