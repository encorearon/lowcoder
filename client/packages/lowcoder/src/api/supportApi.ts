import Api from "api/api";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { useSelector } from "react-redux";
import { getUser, getCurrentUser } from "redux/selectors/usersSelectors";
import { useEffect, useState } from "react";
import { calculateFlowCode }  from "./apiUtils";

export type ResponseType = {
  response: any;
};

export interface Ticket {
  key: string;
  id: string;
  created: string; // ISO date string
  priority: {
    name: string;
    number: string;
  };
  assignee: {
    email: string;
    avatar: string;
    active: boolean;
    timeZone: string;
  };
  status: {
    name: string;
  };
  updated: string; // ISO date string
  title: string;
  description: string;
  lowcoder_userId: string;
  lowcoder_orgId: string;
  lowcoder_host: string;
  lowcoder_subscription: string;
}

export type TicketList = Ticket[];

// Axios Configuration
const lcHeaders = {
  "Lowcoder-Token": calculateFlowCode(),
  "Content-Type": "application/json"
};

let axiosIns: AxiosInstance | null = null;

const getAxiosInstance = (clientSecret?: string) => {
  if (axiosIns && !clientSecret) {
    return axiosIns;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const apiRequestConfig: AxiosRequestConfig = {
    baseURL: "http://localhost:8080/api/flow",
    headers,
  };

  axiosIns = axios.create(apiRequestConfig);
  return axiosIns;
};

class SupportApi extends Api {

  static async secureRequest(body: any): Promise<any> {
    let response;
    try {
      response = await getAxiosInstance().request({
        method: "POST",
        withCredentials: true,
        data: body,
      });
    } catch (error) {
      console.error("Error at Support Flow Request:", error);
    }
    return response;
  }

}

// API Functions

export const searchCustomerTickets = async (orgID : string, currentUserId : string, domain : string) => {

  const apiBody = {
    path: "webhook/support/get-issues",
    data: {host : domain, orgId : orgID, userId : currentUserId, supportsubscriptionId : "1PostVDDlQgecLSfhG52o5rB"},
    method: "post",
    headers: lcHeaders
  };
  try {
    const result = await SupportApi.secureRequest(apiBody);
    return result.data as TicketList;
  } catch (error) {
    console.error("Error searching customer:", error);
    throw error;
  }
};

export const getTicket = async (orgID : string, currentUserId : string, domain : string) => {

  const apiBody = {
    path: "webhook/support/get-issues",
    data: {host : domain, orgId : orgID, userId : currentUserId, supportsubscriptionId : "1PostVDDlQgecLSfhG52o5rB"},
    method: "post",
    headers: lcHeaders
  };
  try {
    const result = await SupportApi.secureRequest(apiBody);
    return result?.data?.data?.length === 1 ? result.data.data as TicketList : null;
  } catch (error) {
    console.error("Error searching customer:", error);
    throw error;
  }
};


export default SupportApi;
