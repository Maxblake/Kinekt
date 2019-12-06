import React, { Fragment } from "react";

import PageTitle from "../../layout/page/PageTitle";
import Question from "./Question";

const FAQ = () => {
  const questionList = [
    {
      questionText: "What is HappenStack?",
      answerText: (
        <Fragment>
          'LFG', or 'Looking For Group', is a common term in online video games.
          Players run around shouting 'LFG' in order to find others that want to
          work together in order to accomplish a shared goal. In a nutshell,
          this is what HappenStack aims to bring into the real world. Our goal
          is to provide a platform for people to easily find and connect with
          others on an emergent basis.
          <br />
          <br />
          Whatever you're up to, HappenStack is the real-time access-anywhere
          group-finding venue that makes it simpler, faster, and easier to help
          you connect more, do more, and live better.
        </Fragment>
      )
    },
    {
      questionText: "How do groups work?",
      answerText: (
        <Fragment>
          Groups are HappenStack's bread and butter! Each group is organized
          within a 'Group Type' which loosely defines its purpose. In general,
          groups are meant to represent things happening either now or soon.
          Since humans like us can (mostly) do only one thing at a time,{" "}
          <strong>users can only be a part of one group at a time.</strong>{" "}
          There are 3 primary types of groups:
          <br />
          <br />
          <strong>Public groups</strong> show up on group type feeds. Anyone is
          free to join at any time.
          <br />
          <strong>Protected groups</strong> also show up on group type feeds.
          Users must request to join, and any of the group's admins can answer
          the request.
          <br />
          <strong>Private groups</strong> do not show up in feeds and cannot be
          searched for. Users can request to join via group code, and any of the
          group's admins can answer the request.
          <br />
          <br />
          While public groups are free to create and join, creating a private or
          protected group will use up one group lock (more info on these in the
          group lock FAQ section). All groups expire 24 hours after creation,
          though it's recommended that users delete their groups as soon as the
          task they were created for is completed.
        </Fragment>
      )
    },
    {
      questionText: "What are group codes and group locks?",
      answerText: (
        <Fragment>
          <strong>Group codes</strong> are unique identifiers for each group.
          They're meant to be passed around and exchanged so that others can
          locate and join your group quickly and easily. You can find your
          group's group code in the upper right corner of the group console, and
          you can join a group via group code using the navbar field at the top
          of any page. <br />
          <br />
          <strong>Group locks</strong> are used to create private and protected
          groups. If you run out, you can restock by following the navbar button
          with the lock on it at the top of any page. Don't forget to use a
          friend's referral code in order to earn both of you extra group locks
          on checkout! This is how HappenStack keeps its servers running; thank
          you to users who take advantage of this feature!
        </Fragment>
      )
    }
  ];

  return (
    <section className="FAQ">
      <nav className="level" id="page-nav">
        <PageTitle title="Frequently Asked Questions" />
      </nav>
      <div className="FAQ-container">
        {questionList.map((question, index) => (
          <Question
            key={index}
            questionText={question.questionText}
            answerText={question.answerText}
          />
        ))}
        <div className="FAQ-question hs-box">
          <div className="FAQ-question-header">
            <h3 className="sdfg">Still have questions?</h3>
          </div>
          <p>Questions and comments can be sent to happenstackhelp@gmail.com</p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
