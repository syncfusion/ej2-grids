import { Component, ModuleDeclaration, L10n, EmitType } from '@syncfusion/ej2-base';import { createElement, remove, classList } from '@syncfusion/ej2-base/dom';import { isNullOrUndefined } from '@syncfusion/ej2-base/util';import { Property, Event, NotifyPropertyChanges, INotifyPropertyChanged } from '@syncfusion/ej2-base';import { NumericContainer } from './numeric-container';import { PagerMessage } from './pager-message';import { ExternalMessage } from './external-message';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class Pager
 */
export interface PagerModel extends ComponentModel{

    /**
     * If `enableQueryString` set to true,        * then it pass current page information as a query string along with the URL while navigating to other page.       * @default false       */    enableQueryString?: boolean;

    /**
     * If `enableExternalMessage` set to true, then it adds the message to Pager.       * @default false       */    enableExternalMessage?: boolean;

    /**
     * If `enablePagerMessage` set to true, then it adds the pager information.       * @default true       */    enablePagerMessage?: boolean;

    /**
     * Defines the records count of visible page.       * @default 12       */    pageSize?: number;

    /**
     * Defines the number of pages to display in pager container.        * @default 10       */    pageCount?: number;

    /**
     * Defines the current page number of pager.        * @default 1       */    currentPage?: number;

    /**
     * Gets or Sets the total records count which is used to render numeric container.        * @default null       */    totalRecordsCount?: number;

    /**
     * Defines the external message of Pager.       * @default null       */    externalMessage?: string;

    /**
     * Defines the customized text to append with numeric items.       * @default null       */    customText?: string;

    /**
     * Triggers when click on the numeric items.        * @default null       */    click?: EmitType<Object>;

    /**
     * Triggers when Pager is created.        * @default null       */    created?: EmitType<Object>;

}