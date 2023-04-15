<script>
  import { marked } from "marked";

  const md = marked(`
  # SPECS

Specs is a permaweb application that is a repository for standards that empower the community to drive change and vote by attribution of value or STAMPing specifications. The SPECs permaweb app gives vouched users the ability to "CREATE" and "REMIX" specifications in [MARKDOWN](https://www.markdownguide.org/cheat-sheet/) - with Front Matter.

> What is front-matter? Front Matter is a pre-pended header of YAML describing meta data for the document.

With "SPECS" you can create a markdown specification document and publish on the permaweb, which can be viewed using a "Renderer" - https://specs.g8way.io/?tx=XXXXXX. To provide open access to all users of the permaweb, so that creators and innovators can leverage these specifications as guides to build amazing protocols and applications to help make the community better and extend knowledge to all who can access the permaweb.

## Features

* List most stamped specifications on https://specs.g8way.io
* View SPEC Documents
* View related SPEC Documents - when viewing a SPEC document, you can also choose to view all of the related documents and their STAMP count
* Create and Publish SPEC Documents - Any Vouched User can create a SPEC Document
* STAMP SPEC Documents - As a Vouched User using [VouchDAO](https://vouch-dao.g8way.io/) 
* Re-MIX SPEC Documents - Any Vouched Community Member can propose an update to a version of a specification by re-mixing. Re-mixing is the process of copying the current version and editing it and publishing a new version. In order for this new version to replace the currently accepted version, the community must stamp it more times that leading stamped version of the specification it relates to. This dynamic empowers the community to have a strong signal on which versions of a given specification is considered to be the "standard". 

<div class="bg-info text-context-info text-sm rounded py-4 px-8">
It is important to note that is a version of a specification is the most stamp, there is no rule in the community stating you must choose that version, these specifications are guides not enforced rules. It is believed if we as a community tend to follow the guides we expontentially increase the value of our own work, but there will always be exceptions and exceptions should be embraced because they may show better results.
</div>

## Source Code

This application is open-source and it is encouraged to recommend and implement improvements to the application so that it may evolve to solve future problems and challenges. This is a community driven application to provide the community with the public square for common guides and lessons learned when building on the permaweb.

## Example Spec Document

\`\`\`md
---
GroupId: SPEC-100
Forks: lbyrfuidwczxlgqrqshpxvsqhwuvumxvupwzdwgqsbf
Title: SPEC-100 - Specification Template
Description: A template for creating specifications
Topics: 
  - spec
  - markdown
  - template
---

# SPEC-100

Status: Draft 

Version: -

## Abstract

This document describes a template that could be used to define consistent specifications for broad use cases in a protocol network that encourages continuous improvement powered by the community.

## Motivation 

Why create a specification standard? To give the community a basic structure to clearly describe a common description of how protocol interfaces can embrace different implementations. As a result encourage data openess and composability without prescriptive implementations. Protocol market fit is discovered by network compliance and usage. When protocols are clearly defined and easy to implement the execution is general and frictionless.

## Specification

The specification template is defined to keep the specification consistently defined with other specifications for a broad case of interpretation by the community for a variety of implmentations that encourage composability and openess.

    # Title
    
    Status: [Draft or Published]
    
    Version: [Version Number]
    
    ## Abstract
    
    A few short sentences that describe the purpose of the specification
    
    ## Motivation 
    
    A few paragraphs providing the "Why" for the specification, what problem does it solve, what use cases does it unlock.
    
    ## Specificaion
    
    A concise description defining the interface of the specification, examples are encouraged but it should not be long or wordy. Direct and to the point of the
    specification to implement.
    

\`\`\`


<div class="my-8 text-xs">
Specs is an application created by and used by the permaweb community, if you are interested in contributing to the specs application check out the github project. <a href="https://github.com/permaweb/specs">https://github.com/permaweb/specs</a>
</div>

`);
</script>

<div class="flex md:mt-8 px-4">
  <div class="flex flex-col flex-1">
    <div class="flex w-full justify-between">
      <h3 class="text-2xl text-[#ff8500] mb-8">Learn More</h3>
      <nav class="flex py-4 px-4 sticky top-0 items-center justify-between" />
    </div>

    <div class="prose prose-invert lg:prose-xl spec-width">
      {@html md}
    </div>
  </div>
</div>
