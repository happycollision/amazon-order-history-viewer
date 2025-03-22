/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from "./routes/__root"
import { Route as UploadImport } from "./routes/upload"
import { Route as IndexImport } from "./routes/index"
import { Route as OrdersRetailImport } from "./routes/orders/retail"

// Create/Update Routes

const UploadRoute = UploadImport.update({
	id: "/upload",
	path: "/upload",
	getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
	id: "/",
	path: "/",
	getParentRoute: () => rootRoute,
} as any)

const OrdersRetailRoute = OrdersRetailImport.update({
	id: "/orders/retail",
	path: "/orders/retail",
	getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module "@tanstack/react-router" {
	interface FileRoutesByPath {
		"/": {
			id: "/"
			path: "/"
			fullPath: "/"
			preLoaderRoute: typeof IndexImport
			parentRoute: typeof rootRoute
		}
		"/upload": {
			id: "/upload"
			path: "/upload"
			fullPath: "/upload"
			preLoaderRoute: typeof UploadImport
			parentRoute: typeof rootRoute
		}
		"/orders/retail": {
			id: "/orders/retail"
			path: "/orders/retail"
			fullPath: "/orders/retail"
			preLoaderRoute: typeof OrdersRetailImport
			parentRoute: typeof rootRoute
		}
	}
}

// Create and export the route tree

export interface FileRoutesByFullPath {
	"/": typeof IndexRoute
	"/upload": typeof UploadRoute
	"/orders/retail": typeof OrdersRetailRoute
}

export interface FileRoutesByTo {
	"/": typeof IndexRoute
	"/upload": typeof UploadRoute
	"/orders/retail": typeof OrdersRetailRoute
}

export interface FileRoutesById {
	__root__: typeof rootRoute
	"/": typeof IndexRoute
	"/upload": typeof UploadRoute
	"/orders/retail": typeof OrdersRetailRoute
}

export interface FileRouteTypes {
	fileRoutesByFullPath: FileRoutesByFullPath
	fullPaths: "/" | "/upload" | "/orders/retail"
	fileRoutesByTo: FileRoutesByTo
	to: "/" | "/upload" | "/orders/retail"
	id: "__root__" | "/" | "/upload" | "/orders/retail"
	fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
	IndexRoute: typeof IndexRoute
	UploadRoute: typeof UploadRoute
	OrdersRetailRoute: typeof OrdersRetailRoute
}

const rootRouteChildren: RootRouteChildren = {
	IndexRoute: IndexRoute,
	UploadRoute: UploadRoute,
	OrdersRetailRoute: OrdersRetailRoute,
}

export const routeTree = rootRoute
	._addFileChildren(rootRouteChildren)
	._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/upload",
        "/orders/retail"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/upload": {
      "filePath": "upload.tsx"
    },
    "/orders/retail": {
      "filePath": "orders/retail.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
